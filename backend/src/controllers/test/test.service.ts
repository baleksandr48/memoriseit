import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm/index';
import { Test } from '../../models/test.model';
import {
  TestCreate,
  TestForChecking,
  TestInputAnswer,
  TestInputUserAnswer,
  TestMultipleAnswer,
  TestOrderingAnswer,
  TestOrderingUserAnswer,
  TestSingleAnswer,
  TestSingleUserAnswer,
  TestUpdate,
} from './types-and-schemas';
import { TEST_TYPE } from '../../constants';
import * as _ from 'lodash';
import { TestResults } from '../../models/test-results.model';
import { User } from '../../models/user.model';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
    @InjectRepository(TestResults)
    private testResultsRepository: Repository<TestResults>,
  ) {}

  async saveTestsForArticle(
    articleId: number,
    testsForArticle: Array<TestUpdate | TestCreate>,
  ) {
    const oldTestsForArticle = await this.testRepository.find({
      articleId,
    });

    const testsCreate = testsForArticle.filter(
      // @ts-ignore
      testForArticle => !testForArticle.id,
    ) as TestCreate[];

    const testsUpdate = testsForArticle.filter(
      // @ts-ignore
      testForArticle => testForArticle.id,
    ) as TestUpdate[];

    const testsRemove = oldTestsForArticle.filter(
      oldTest => !testsUpdate.some(testUpdate => testUpdate.id === oldTest.id),
    );

    let promises: Promise<any>[] = [];
    if (testsRemove.length) {
      promises = promises.concat(
        this.testRepository.delete(_.map(testsRemove, 'id')),
      );
    }
    promises = promises.concat(
      [...testsUpdate, ...testsCreate].map(testForArticleUpdate =>
        this.testRepository.save({
          ...testForArticleUpdate,
          articleId,
        }),
      ),
    );
    await Promise.all(promises);
  }

  async saveResults(
    articleId: number,
    testsWithAnswers: Test[],
    currentUser: User,
  ) {
    const mistakes = testsWithAnswers.reduce((acc, test) => {
      switch (test.type) {
        case TEST_TYPE.INPUT: {
          const testInputAnswers = test.answers as TestInputAnswer &
            TestInputUserAnswer;
          if (testInputAnswers.correctAnswer !== testInputAnswers.userAnswer) {
            acc++;
          }
        }
        case TEST_TYPE.SINGLE:
        case TEST_TYPE.MULTIPLE: {
          const multipleTestAnswers = test.answers as Array<
            TestSingleAnswer & TestSingleUserAnswer
          >;
          if (
            multipleTestAnswers.some(
              answer => !!answer.isCheckedByUser !== !!answer.isCorrect,
            )
          ) {
            acc++;
          }
        }
        case TEST_TYPE.ORDERING: {
          const orderingTestAnswers = test.answers as Array<
            TestOrderingAnswer & TestOrderingUserAnswer
          >;
          if (
            orderingTestAnswers.some(
              answer => answer.correctPosition !== answer.userPosition,
            )
          ) {
            acc++;
          }
        }
      }
      return acc;
    }, 0);
    const testResultItem = await this.testResultsRepository.findOne({
      where: {
        articleId,
        userId: currentUser.id,
      },
    });
    const result =
      (testsWithAnswers.length - mistakes) / testsWithAnswers.length;
    if (testResultItem) {
      await this.testResultsRepository.update(testResultItem.id, {
        result,
      });
    } else {
      await this.testResultsRepository.save({
        articleId,
        userId: currentUser.id,
        result,
      });
    }
  }

  async checkResults(articleId: number, testsForChecking: TestForChecking[]) {
    const testIds = _.map(testsForChecking, 'id');

    let tests = await this.testRepository.find({
      where: {
        id: In(testIds),
      },
    });
    testsForChecking = testsForChecking.sort(
      testForChecking => testForChecking.id,
    );
    tests = tests.sort(test => test.id);
    _.merge(tests, testsForChecking);
    return tests;
  }

  getTestsForArticle(articleId: number) {
    return this.testRepository.find({
      where: {
        articleId,
      },
    });
  }

  removeCorrectAnswersFromTest(test: Test) {
    switch (test.type) {
      case TEST_TYPE.INPUT: {
        delete (test.answers as TestInputAnswer).correctAnswer;
        return test;
      }
      case TEST_TYPE.SINGLE:
      case TEST_TYPE.MULTIPLE: {
        for (const answer of test.answers as
          | TestSingleAnswer[]
          | TestMultipleAnswer[]) {
          delete answer.isCorrect;
        }
        return test;
      }
      case TEST_TYPE.ORDERING: {
        for (const answer of test.answers as TestOrderingAnswer[]) {
          delete answer.correctPosition;
        }
        return test;
      }
      default: {
        throw new InternalServerErrorException(`Unsupported type of test.`);
      }
    }
  }
}
