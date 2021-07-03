import { TestService } from './test.service';
import * as NestTest from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../config';
import { Article } from '../../models/article.model';
import { Connection, Repository } from 'typeorm/index';
import { TEST_TYPE } from '../../constants';
import { Test } from '../../models/test.model';
import { Topic } from '../../models/topic.model';

describe('TestService', () => {
  let testService: TestService;
  let connection: Connection;
  let topicRepository: Repository<Topic>;
  let articleRepository: Repository<Article>;
  let testRepository: Repository<Test>;

  beforeAll(async () => {
    const testModule: NestTest.TestingModule = await NestTest.Test.createTestingModule(
      {
        imports: [
          TypeOrmModule.forRoot(config.db),
          TypeOrmModule.forFeature([Article, Test, Topic]),
        ],
        providers: [TestService],
      },
    ).compile();
    testService = testModule.get<TestService>(TestService);
    connection = testModule.get<Connection>(Connection);
    articleRepository = testModule.get<Repository<Article>>(
      getRepositoryToken(Article),
    );
    topicRepository = testModule.get<Repository<Topic>>(
      getRepositoryToken(Topic),
    );
    testRepository = testModule.get<Repository<Test>>(getRepositoryToken(Test));
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('saveTestsForArticle method', () => {
    let createdTopic: Topic;
    let createdArticle: Article;
    let createdTest: Test;
    let oldQuestion = '1+1=?';

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

      createdTest = await testRepository.save({
        type: TEST_TYPE.INPUT,
        answers: {
          correctAnswer: '2',
        },
        question: oldQuestion,
        articleId: createdArticle.id,
      });
    });

    it(`should delete some tests`, async () => {
      await testService.saveTestsForArticle(createdArticle.id, []);
      const allTests = await testRepository.find();
      expect(allTests).toHaveLength(0);
    });

    it(`should update some tests`, async () => {
      const newQuestion = '2+2=?';
      await testService.saveTestsForArticle(createdArticle.id, [
        {
          id: createdTest.id,
          type: TEST_TYPE.INPUT,
          articleId: createdArticle.id,
          question: newQuestion,
          answers: {
            correctAnswer: '4',
          },
        },
      ]);
      const allTests = await testRepository.find();
      expect(allTests).toHaveLength(1);
      expect(oldQuestion !== newQuestion).toBeTruthy();
      expect(allTests[0].question).toEqual(newQuestion);
    });

    it(`should create new tests`, async () => {
      await testService.saveTestsForArticle(createdArticle.id, [
        {
          articleId: createdArticle.id,
          type: TEST_TYPE.INPUT,
          question: '2+2=?',
          answers: {
            correctAnswer: '4',
          },
        },
      ]);
      const allTests = await testRepository.find();
      expect(allTests).toHaveLength(1);
      expect(allTests[0]).toEqual({
        id: allTests[0].id,
        type: TEST_TYPE.INPUT,
        articleId: createdArticle.id,
        question: '2+2=?',
        answers: {
          correctAnswer: '4',
        },
      });
    });
  });

  describe(`removeCorrectAnswersFromTest method`, () => {
    const commonFields = {
      id: 1,
      question: 'question',
      articleId: 1,
    };

    it(`should remove correct answer from INPUT test`, () => {
      const test: Test = {
        ...commonFields,
        type: TEST_TYPE.INPUT,
        answers: {
          correctAnswer: 'answer',
        },
      };
      const result = testService.removeCorrectAnswersFromTest(test);
      expect(result).toEqual({
        ...commonFields,
        type: TEST_TYPE.INPUT,
        answers: {},
      });
    });

    it(`should remove correct answer from SINGLE test`, () => {
      const test: Test = {
        ...commonFields,
        type: TEST_TYPE.SINGLE,
        answers: [
          {
            text: 'text 1',
          },
          {
            text: 'text 2',
            isCorrect: true,
          },
        ],
      };
      const result = testService.removeCorrectAnswersFromTest(test);
      expect(result).toEqual({
        ...commonFields,
        type: TEST_TYPE.SINGLE,
        answers: [
          {
            text: 'text 1',
          },
          {
            text: 'text 2',
          },
        ],
      });
    });

    it(`should remove correct answer from MULTIPLE test`, () => {
      const test: Test = {
        ...commonFields,
        type: TEST_TYPE.MULTIPLE,
        answers: [
          {
            text: 'text 1',
            isCorrect: true,
          },
          {
            text: 'text 2',
            isCorrect: true,
          },
        ],
      };
      const result = testService.removeCorrectAnswersFromTest(test);
      expect(result).toEqual({
        ...commonFields,
        type: TEST_TYPE.MULTIPLE,
        answers: [
          {
            text: 'text 1',
          },
          {
            text: 'text 2',
          },
        ],
      });
    });

    it(`should remove correct answer from ORDERING test`, () => {
      const test: Test = {
        ...commonFields,
        type: TEST_TYPE.ORDERING,
        answers: [
          {
            text: 'text 1',
            correctPosition: 1,
          },
          {
            text: 'text 2',
            correctPosition: 2,
          },
        ],
      };
      const result = testService.removeCorrectAnswersFromTest(test);
      expect(result).toEqual({
        ...commonFields,
        type: TEST_TYPE.ORDERING,
        answers: [
          {
            text: 'text 1',
          },
          {
            text: 'text 2',
          },
        ],
      });
    });
  });

  describe(`checkResults method`, () => {
    let createdTopic: Topic;
    let createdArticle: Article;
    let createdTestInput: Test;
    let createdTestSingle: Test;
    let createdTestMultiple: Test;

    beforeAll(async () => {
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

      const commonFields = {
        articleId: createdArticle.id,
        question: 'question',
      };
      [
        createdTestInput,
        createdTestSingle,
        createdTestMultiple,
      ] = await testRepository.save([
        {
          type: TEST_TYPE.INPUT,
          answers: {
            correctAnswer: 'correctAnswer',
          },
          ...commonFields,
        },
        {
          type: TEST_TYPE.SINGLE,
          answers: [
            { text: 'text1', isCorrect: false },
            { text: 'text2', isCorrect: true },
          ],
          ...commonFields,
        },
        {
          type: TEST_TYPE.MULTIPLE,
          answers: [
            { text: 'text1', isCorrect: true },
            { text: 'text2', isCorrect: true },
          ],
          ...commonFields,
        },
      ]);
    });

    it(`should return tests with user answer and correct answer`, async () => {
      const result = await testService.checkResults(createdArticle.id, [
        {
          id: createdTestInput.id,
          type: TEST_TYPE.INPUT,
          answers: {
            userAnswer: 'userAnswer',
          },
        },
        {
          id: createdTestSingle.id,
          type: TEST_TYPE.SINGLE,
          answers: [
            { text: 'text1', isCheckedByUser: true },
            { text: 'text2', isCheckedByUser: false },
          ],
        },
        {
          id: createdTestMultiple.id,
          type: TEST_TYPE.MULTIPLE,
          answers: [
            { text: 'text1', isCheckedByUser: true },
            { text: 'text2', isCheckedByUser: false },
          ],
        },
      ]);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        ...createdTestInput,
        answers: {
          correctAnswer: 'correctAnswer',
          userAnswer: 'userAnswer',
        },
      });
      expect(result[1]).toEqual({
        ...createdTestSingle,
        answers: [
          { text: 'text1', isCheckedByUser: true, isCorrect: false },
          { text: 'text2', isCheckedByUser: false, isCorrect: true },
        ],
      });
      expect(result[2]).toEqual({
        ...createdTestMultiple,
        answers: [
          { text: 'text1', isCheckedByUser: true, isCorrect: true },
          { text: 'text2', isCheckedByUser: false, isCorrect: true },
        ],
      });
    });
  });
});
