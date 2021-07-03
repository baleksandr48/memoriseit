import { TopicService } from './topic.service';
import { Test as NestJsTest, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../config';
import { Connection, Repository } from 'typeorm/index';
import { Topic } from '../../models/topic.model';
import { Article } from '../../models/article.model';
import { CONTRIBUTOR_TYPE } from '../../constants';
import { ArticleModule } from '../articles/article.module';
import { forwardRef } from '@nestjs/common';
import { User } from '../../models/user.model';

describe('TopicService', () => {
  let topicService: TopicService;
  let connection: Connection;
  let topicRepository: Repository<Topic>;
  let articleRepository: Repository<Article>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const testModule: TestingModule = await NestJsTest.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config.db),
        TypeOrmModule.forFeature([Article, Topic, User]),
        forwardRef(() => ArticleModule),
      ],
      providers: [TopicService],
    }).compile();
    topicService = testModule.get<TopicService>(TopicService);
    connection = testModule.get<Connection>(Connection);
    topicRepository = testModule.get<Repository<Topic>>(
      getRepositoryToken(Topic),
    );
    articleRepository = testModule.get<Repository<Article>>(
      getRepositoryToken(Article),
    );
    userRepository = testModule.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    await connection.close();
  });

  describe(`createTopic method`, () => {
    let currentUser: User;

    beforeEach(async () => {
      await topicRepository.delete({});
      await userRepository.delete({});
      currentUser = await userRepository.save({
        name: 'name',
        email: 'email',
      });
    });

    it(`should save topic to db`, async () => {
      const createdTopic = await topicService.create(
        {
          description: 'description',
          name: 'name',
        },
        currentUser,
      );
      const topicFromDb = await topicService.getTopicById(createdTopic.id);
      expect(createdTopic.id).toEqual(topicFromDb!.id);
    });
  });

  describe(`getArticleTrees method`, () => {
    let topic: Topic;

    beforeAll(async () => {
      await topicRepository.delete({});

      topic = await topicRepository.save({
        name: 'name',
        description: 'description',
      });
      const tempt = {
        text: 'text',
        title: 'title',
        topicId: topic.id,
        order: 1,
      };
      const a = await articleRepository.save({ ...tempt });
      const b = await articleRepository.save({ ...tempt });
      const aa = await articleRepository.save({
        ...tempt,
        parentId: a.id,
      });
    });

    it(`should return trees of child articles`, async () => {
      const childArticles = await topicService.getArticleTrees(topic.id);
      expect(childArticles).toHaveLength(2);
      expect(
        childArticles.some(article => !!article.children!.length),
      ).toBeTruthy();
    });
  });

  describe(`buildArticleTrees method`, () => {
    it(`should build article trees`, () => {
      const common = {
        topicId: 1,
        order: 0,
      };
      expect(
        topicService.buildArticleTrees([
          {
            id: 1,
            isGroup: false,
            title: 'title',
            text: 'text',
            ...common,
          },
          {
            id: 2,
            isGroup: true,
            title: 'title',
            parentId: 4,
            text: 'text',
            ...common,
          },
          {
            id: 3,
            parentId: 2,
            isGroup: false,
            title: 'title',
            text: 'text',
            ...common,
          },
        ]),
      ).toEqual([
        {
          id: 1,
          order: 0,
          isGroup: false,
          title: 'title',
          text: 'text',
          topicId: 1,
        },
        {
          children: [
            {
              id: 3,
              order: 0,
              parentId: 2,
              isGroup: false,
              text: 'text',
              title: 'title',
              topicId: 1,
            },
          ],
          id: 2,
          order: 0,
          text: 'text',
          parentId: 4,
          isGroup: true,
          title: 'title',
          topicId: 1,
        },
      ]);
    });
  });

  describe(`getTopicsContributedByUser method`, () => {
    let userAlice: User;
    let userBob: User;

    beforeEach(async () => {
      await topicRepository.delete({});
      await userRepository.delete({});
      [userAlice, userBob] = await userRepository.save([
        {
          name: 'Alice',
          email: 'alice@mail.com',
        },
        {
          name: 'Bob',
          email: 'bob@mail.com',
        },
      ]);
    });

    it(`should return only 1 topic contributed by user`, async () => {
      await topicRepository.save({
        name: 'name',
        description: 'description',
        contributors: [
          {
            type: CONTRIBUTOR_TYPE.CREATOR,
            user: userAlice,
          },
          {
            type: CONTRIBUTOR_TYPE.CREATOR,
            user: userBob,
          },
        ],
      });
      await topicRepository.save({
        name: 'name',
        description: 'description',
        contributors: [
          {
            type: CONTRIBUTOR_TYPE.CREATOR,
            user: userBob,
          },
        ],
      });

      const result = await topicService.getTopicsContributedByUser(userAlice);
      expect(result).toHaveLength(1);
    });
  });

  describe(`getTopicPageForManaging method`, () => {
    let topic: Topic;

    beforeAll(async () => {
      await topicRepository.delete({});

      topic = await topicRepository.save({
        name: 'name',
        description: 'description',
      });
      const tempt = {
        text: 'text',
        title: 'title',
        topicId: topic.id,
        order: 1,
      };
      const a = await articleRepository.save({ ...tempt });
      const b = await articleRepository.save({ ...tempt });
      const aa = await articleRepository.save({
        ...tempt,
        parentId: a.id,
      });
    });

    it(`should return topic`, async () => {
      const result = await topicService.getTopicPage(topic.id);
      expect(result).toBeTruthy();
    });

    it(`topic should have table of contents`, async () => {
      const result = await topicService.getTopicPage(topic.id);
      expect(result.tableOfContents).toBeTruthy();
    });

    it(`topic should have table of contents consist of [a, b, aa]`, async () => {
      const result = await topicService.getTopicPage(topic.id);
      expect(result.tableOfContents.children).toHaveLength(2);
      expect(
        result.tableOfContents!.children!.some(el => el.children?.length === 1),
      ).toBeTruthy();
      expect(
        result.tableOfContents!.children!.some(el => !el.children),
      ).toBeTruthy();
    });
  });
});
