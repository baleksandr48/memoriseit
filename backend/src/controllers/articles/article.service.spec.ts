import { ArticleService } from './article.service';
import { Test as NestJsTest, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../config';
import { Article } from '../../models/article.model';
import { Connection, Repository } from 'typeorm/index';
import { Contributor } from '../../models/contributor.model';
import { Topic } from '../../models/topic.model';
import { TopicModule } from '../topic/topic.module';
import { TestModule } from '../test/test.module';

describe('ArticleService', () => {
  let articleService: ArticleService;
  let connection: Connection;
  let articleRepository: Repository<Article>;
  let contributorRepository: Repository<Contributor>;
  let topicRepository: Repository<Topic>;

  beforeAll(async () => {
    const testModule: TestingModule = await NestJsTest.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config.db),
        TypeOrmModule.forFeature([Article, Topic, Contributor]),
        TopicModule,
        TestModule,
      ],
      providers: [ArticleService],
    }).compile();
    articleService = testModule.get<ArticleService>(ArticleService);
    connection = testModule.get<Connection>(Connection);
    articleRepository = testModule.get<Repository<Article>>(
      getRepositoryToken(Article),
    );
    contributorRepository = testModule.get<Repository<Contributor>>(
      getRepositoryToken(Contributor),
    );
    topicRepository = testModule.get<Repository<Topic>>(
      getRepositoryToken(Topic),
    );
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('create method', () => {
    let createdTopic: Topic;

    beforeEach(async () => {
      await topicRepository.delete({});
      createdTopic = await topicRepository.save({
        name: 'name',
        description: 'description',
      });
    });

    it(`should create article`, async () => {
      const article = await articleService.create({
        text: 'text',
        title: 'title',
        topicId: createdTopic.id,
      });
      const articleFromDb = await articleRepository.findOne(article.id);
      expect(article).toBeTruthy();
      expect(articleFromDb).toBeTruthy();
      expect(articleFromDb?.order).toEqual(1);
    });

    it(`next article should has next order`, async () => {
      await articleService.create({
        text: 'text',
        title: 'title',
        topicId: createdTopic.id,
      });
      const article = await articleService.create({
        text: 'text',
        title: 'title',
        topicId: createdTopic.id,
      });
      expect(article.order).toEqual(2);
    });
  });

  describe('update method', () => {
    let createdTopic: Topic;
    let createdArticle: Article;

    beforeEach(async () => {
      await topicRepository.delete({});
      createdTopic = await topicRepository.save({
        name: 'name',
        description: 'description',
      });
      createdArticle = await articleRepository.save({
        text: 'text',
        title: 'title',
        topicId: createdTopic.id,
        order: 1,
      });
    });

    it(`should update article`, async () => {
      await articleService.update(createdArticle.id, {
        title: 'new title',
        text: 'net text',
      });
      const updatedArticle = await articleRepository.findOne(createdArticle.id);
      expect(updatedArticle?.title).toEqual('new title');
      expect(updatedArticle?.text).toEqual('net text');
    });
  });

  describe('getArticlePage method', () => {
    let createdTopic: Topic;
    let articleAA: Article;

    beforeEach(async () => {
      await topicRepository.delete({});
      createdTopic = await topicRepository.save({
        name: 'name',
        description: 'description',
      });
      const articleA = await articleRepository.save({
        text: 'a',
        title: 'a',
        topicId: createdTopic.id,
        order: 1,
      });
      const articleB = await articleRepository.save({
        text: 'b',
        title: 'b',
        topicId: createdTopic.id,
        order: 2,
      });
      articleAA = await articleRepository.save({
        text: 'aa',
        title: 'aa',
        topicId: createdTopic.id,
        order: 1,
        parentId: articleA.id,
      });
    });

    it(`should return props for article page`, async () => {
      const { topic, article, tests } = await articleService.getArticlePage(
        articleAA.id,
      );
      expect(tests).toBeTruthy();
      expect(article.id).toEqual(articleAA.id);
      expect(topic).toBeTruthy();
      expect(topic.contributors).toBeTruthy();
      expect(topic.tableOfContents.children).toHaveLength(2);
      expect(
        topic.tableOfContents.children!.some(el => !!el.children?.length),
      ).toBeTruthy();
    });
  });
});
