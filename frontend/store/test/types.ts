import { START_SUCCESS_ERROR } from "../../utils";

export interface TestInputAnswer {
  correctAnswer?: string;
  userAnswer?: string;
}

export interface TestSingleAnswer {
  text: string;
  isCorrect?: boolean;
  isCheckedByUser?: boolean;
}

export interface TestMultipleAnswer {
  text: string;
  isCorrect?: boolean;
  isCheckedByUser?: boolean;
}

export interface TestOrderingAnswer {
  text: string;
  correctPosition?: number;
  userPosition?: number;
}

export type TestAnswers =
  | TestInputAnswer
  | TestSingleAnswer[]
  | TestMultipleAnswer[]
  | TestOrderingAnswer[];

export interface TestCreate {
  question: string;
  type: TEST_TYPE;
  articleId: number;
  answers: TestAnswers;
}

export enum TEST_TYPE {
  MULTIPLE = "MULTIPLE",
  SINGLE = "SINGLE",
  INPUT = "INPUT",
  ORDERING = "ORDERING"
}

export interface Test {
  id: number;
  articleId: number;
  type: TEST_TYPE;
  question: string;
  answers: TestAnswers;
}

export enum TEST_DISPLAY_MODE {
  EDIT = "EDIT",
  SOLVE = "SOLVE",
  RESULTS = "RESULTS"
}

//---ACTION_NAMES---
export const TestActionTypes = {
  CHECK_TEST_USER_ANSWERS: START_SUCCESS_ERROR("CHECK_TEST_USER_ANSWERS"),
  TEST_LOADING: "TEST_LOADING",
  TEST_ERROR: "TEST_ERROR",
  ADD_EMPTY_TEST: "ADD_EMPTY_TEST",
  REMOVE_TEST: "REMOVE_TEST",
  EDIT_TEST_TYPE: "EDIT_TEST_TYPE",
  EDIT_TEST_QUESTION: "EDIT_TEST_QUESTION",
  EDIT_TEST_ANSWER: "EDIT_TEST_ANSWER",
  REMOVE_TEST_ANSWER: "REMOVE_TEST_ANSWER",
  EDIT_TEST_USER_ANSWER: "EDIT_TEST_USER_ANSWER",
  MOVE_TEST_ANSWER: "MOVE_TEST_ANSWER"
};

//---ACTION_PAYLOADS---
export type RemoveTestPayload = Pick<Test, "id">;
export type EditTestTypePayload = Pick<Test, "id" | "type">;
export type EditTestQuestionPayload = Pick<Test, "id" | "question">;
export type EditTestAnswerPayload = Pick<Test, "id"> & {
  position?: number;
  answer: Partial<
    TestOrderingAnswer | TestSingleAnswer | TestInputAnswer | TestMultipleAnswer
  >;
};
export type RemoveTestAnswerPayload = Pick<Test, "id"> & {
  position: number;
};
export type MoveTestAnswerPayload = Pick<Test, "id"> & {
  sourcePosition: number;
  destinationPosition?: number;
};

export type EditTestUserAnswersPayload = Pick<Test, "id"> & {
  position?: number;
  answer: Partial<
    TestOrderingAnswer | TestSingleAnswer | TestInputAnswer | TestMultipleAnswer
  >;
};

export type CheckTestUserAnswersPayload = {
  testsWithCorrectAnswers: Test[];
};

export interface TestErrorPayload {
  error: string;
}

//---OTHER---
export interface TestsState {
  loading: boolean;
  error: string | null;
  tests: Test[];
  displayMode: TEST_DISPLAY_MODE;
}

export interface AddEmptyTestPayload {
  articleId: number;
}
