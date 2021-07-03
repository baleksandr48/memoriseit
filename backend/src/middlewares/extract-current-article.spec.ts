import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm/index';
import { Article } from '../models/article.model';
import { config } from '../config';
import { ExtractCurrentArticleMiddleware } from './extract-current-article.middleware';
import { Topic } from '../models/topic.model';

describe('ExtractCurrentArticleMiddleware', () => {
  let extractCurrentArticleMiddleware: ExtractCurrentArticleMiddleware;
  let connection: Connection;
  let articleRepository: Repository<Article>;
  let topicRepository: Repository<Topic>;

  let createdTopic: Topic;
  let createdArticle: Article;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config.db),
        TypeOrmModule.forFeature([Article, Topic]),
      ],
      providers: [ExtractCurrentArticleMiddleware],
    }).compile();

    extractCurrentArticleMiddleware = testModule.get<
      ExtractCurrentArticleMiddleware
    >(ExtractCurrentArticleMiddleware);
    articleRepository = testModule.get<Repository<Article>>(
      getRepositoryToken(Article),
    );
    topicRepository = testModule.get<Repository<Topic>>(
      getRepositoryToken(Topic),
    );
  });

  beforeEach(async () => {
    await topicRepository.delete({});

    createdTopic = await topicRepository.save({
      name: 'name',
      description: 'description',
    });
    createdArticle = await articleRepository.save({
      title: 'title',
      text: 'text',
      topic: createdTopic,
      order: 1,
    });
  });

  afterAll(async () => {
    await connection.close();
  });

  it(`should put article to req object`, async () => {
    const req: any = {
      params: {
        articleId: createdArticle.id,
      },
    };
    const res: any = null;
    const next = () => {};
    await extractCurrentArticleMiddleware.use(req, res, next);
    expect(req.payload.article).toBeTruthy();
  });

  it(`should return error. entity is not an article`, async () => {
    const req: any = {
      params: {
        articleId: createdTopic.id,
      },
    };
    const res: any = null;
    const next = () => {};
    await expect(
      extractCurrentArticleMiddleware.use(req, res, next),
    ).rejects.toThrow();
  });
});
