import joi from 'joi';
import { TEST_TYPE } from '../../constants';
import { validate } from '../../utils/validate';

const TEST_ANSWERS_MAX_NUMBER = 100;

export interface TestInputAnswer {
  correctAnswer: string;
}

export interface TestSingleAnswer {
  text: string;
  isCorrect?: boolean;
}

export interface TestMultipleAnswer {
  text: string;
  isCorrect?: boolean;
}

export interface TestOrderingAnswer {
  text: string;
  correctPosition: number;
}

export type TestAnswers =
  | TestInputAnswer
  | TestSingleAnswer[]
  | TestMultipleAnswer[]
  | TestOrderingAnswer[];

export interface TestInputUserAnswer {
  userAnswer: string;
}

export interface TestSingleUserAnswer {
  text: string;
  isCheckedByUser?: boolean;
}

export interface TestMultipleUserAnswer {
  text: string;
  isCheckedByUser?: boolean;
}

export interface TestOrderingUserAnswer {
  text: string;
  userPosition: number;
}

export type TestUserAnswers =
  | TestInputUserAnswer
  | TestSingleUserAnswer[]
  | TestMultipleUserAnswer[]
  | TestOrderingUserAnswer[];

export interface TestCreate {
  question: string;
  type: TEST_TYPE;
  articleId: number;
  answers: TestAnswers;
}

export interface TestForChecking {
  id: number;
  type: TEST_TYPE;
  answers: TestUserAnswers;
}

export type TestUpdate = Partial<TestCreate> &
  Pick<TestCreate, 'type'> & {
    id: number;
  };

export const testInputAnswerCreateSchema = joi
  .object({
    correctAnswer: joi
      .string()
      .trim()
      .required(),
  })
  .unknown(true);

export const testInputUserAnswerCreateSchema = joi
  .object({
    userAnswer: joi
      .string()
      .trim()
      .default(''),
  })
  .unknown(true);

export const testSingleOrMultipleAnswerCreateSchema = joi
  .object({
    text: joi
      .string()
      .trim()
      .required(),
    isCorrect: joi.boolean().default(false),
  })
  .unknown(true);

export const testSingleOrMultipleUserAnswerCreateSchema = joi
  .object({
    text: joi
      .string()
      .trim()
      .required(),
    isCheckedByUser: joi.boolean().default(false),
  })
  .unknown(true);

export const testOrderingUserAnswerCreateSchema = joi
  .object({
    text: joi
      .string()
      .trim()
      .required(),
    correctPosition: joi
      .number()
      .integer()
      .positive()
      .required(),
  })
  .unknown(true);

export const testOrderingAnswerCreateSchema = joi.object({
  text: joi
    .string()
    .trim()
    .required(),
  userPosition: joi
    .number()
    .integer()
    .positive()
    .required(),
});

export const testAnswersSchema = joi.custom((value, helpers) => {
  switch (helpers.state.ancestors[0].type) {
    case TEST_TYPE.INPUT: {
      return validate(testInputAnswerCreateSchema, value);
    }
    case TEST_TYPE.SINGLE: {
      const result: TestSingleAnswer[] = validate(
        joi
          .array()
          .items(testSingleOrMultipleAnswerCreateSchema)
          .min(2)
          .max(TEST_ANSWERS_MAX_NUMBER),
        value,
      );
      let correctAnswersNumber = 0;
      for (const answer of result) {
        if (answer.isCorrect) {
          correctAnswersNumber++;
        }
      }
      if (correctAnswersNumber !== 1) {
        throw new Error(`test of type SINGLE should contain 1 correct answer`);
      }
      return result;
    }
    case TEST_TYPE.MULTIPLE: {
      return validate(
        joi
          .array()
          .items(testSingleOrMultipleAnswerCreateSchema)
          .min(2)
          .max(TEST_ANSWERS_MAX_NUMBER),
        value,
      );
    }
    case TEST_TYPE.ORDERING: {
      const result = validate<TestOrderingAnswer[]>(
        joi
          .array()
          .items(testOrderingAnswerCreateSchema)
          .min(2)
          .max(TEST_ANSWERS_MAX_NUMBER),
        value,
      );

      const positions: { [T: number]: boolean } = {};
      for (const answer of result) {
        if (positions[answer.correctPosition]) {
          throw new Error(
            `Test of type ORDERING contains a few answers with the same position`,
          );
        }
        positions[answer.correctPosition] = true;
      }

      for (let i = 1; i <= result.length; i++) {
        if (!result.find(el => el.correctPosition === i)) {
          throw new Error(
            `Positions ORDERING test's answers should begin from 1 and increase on 1 without skips`,
          );
        }
      }

      return result;
    }
    default: {
      return helpers.error(`unsupported test type: ${value}`);
    }
  }
});

export const testUserAnswersSchema = joi.custom((value, helpers) => {
  switch (helpers.state.ancestors[0].type) {
    case TEST_TYPE.INPUT: {
      return validate(testInputUserAnswerCreateSchema, value);
    }
    case TEST_TYPE.SINGLE: {
      const result: TestSingleUserAnswer[] = validate(
        joi
          .array()
          .items(testSingleOrMultipleUserAnswerCreateSchema)
          .min(2)
          .max(TEST_ANSWERS_MAX_NUMBER),
        value,
      );
      let checkedAnswersNumber = 0;
      for (const answer of result) {
        if (answer.isCheckedByUser) {
          checkedAnswersNumber++;
        }
      }
      if (checkedAnswersNumber !== 1) {
        throw new Error(`test of type SINGLE should contain 1 user answer`);
      }
      return result;
    }
    case TEST_TYPE.MULTIPLE: {
      return validate(
        joi
          .array()
          .items(testSingleOrMultipleUserAnswerCreateSchema)
          .min(2)
          .max(TEST_ANSWERS_MAX_NUMBER),
        value,
      );
    }
    case TEST_TYPE.ORDERING: {
      const result = validate<TestOrderingUserAnswer[]>(
        joi
          .array()
          .items(testOrderingUserAnswerCreateSchema)
          .min(2)
          .max(TEST_ANSWERS_MAX_NUMBER),
        value,
      );

      const positions: { [T: number]: boolean } = {};
      for (const answer of result) {
        if (positions[answer.userPosition]) {
          throw new Error(
            `Test of type ORDERING contains a few user answers with the same position`,
          );
        }
        positions[answer.userPosition] = true;
      }

      for (let i = 1; i <= result.length; i++) {
        if (!result.find(el => el.userPosition === i)) {
          throw new Error(
            `Positions ORDERING test's answers should begin from 1 and increase on 1 without skips`,
          );
        }
      }

      return result;
    }
    default: {
      return helpers.error(`unsupported test type: ${value}`);
    }
  }
});

export const testQuestionSchema = joi
  .string()
  .trim()
  .min(3)
  .max(2000);

export const testTypeSchema = joi
  .string()
  .trim()
  .valid(
    TEST_TYPE.INPUT,
    TEST_TYPE.SINGLE,
    TEST_TYPE.MULTIPLE,
    TEST_TYPE.ORDERING,
  );

export const testArticleIdSchema = joi.number();

export const testCreateSchema = joi.object({
  question: testQuestionSchema.required(),
  type: testTypeSchema.required(),
  articleId: testArticleIdSchema.required(),
  answers: testAnswersSchema.required(),
});

export const testUpdateSchema = testCreateSchema.keys({
  id: joi.number().required(),
  type: testTypeSchema,
  question: testQuestionSchema,
  articleId: testArticleIdSchema,
  answers: testAnswersSchema,
});

export const testSaveSchema = joi
  .array()
  .items(testCreateSchema, testUpdateSchema);

export const testForCheckingSchema = joi
  .object({
    id: joi.number().required(),
    type: testTypeSchema,
    answers: testUserAnswersSchema,
  })
  .unknown(true);

export const testsForCheckingSchema = joi.array().items(testForCheckingSchema);
