import _ from "lodash";
import {
  AddEmptyTestPayload,
  CheckTestUserAnswersPayload,
  EditTestAnswerPayload,
  EditTestQuestionPayload,
  EditTestTypePayload,
  MoveTestAnswerPayload,
  RemoveTestAnswerPayload,
  RemoveTestPayload,
  Test,
  TEST_DISPLAY_MODE,
  TEST_TYPE,
  TestActionTypes,
  TestErrorPayload,
  TestInputAnswer,
  TestMultipleAnswer,
  TestOrderingAnswer,
  TestSingleAnswer,
  TestsState
} from "./types";
import { toast } from "react-toastify";

export const testsInitState: TestsState = {
  error: null,
  loading: false,
  tests: [],
  displayMode: TEST_DISPLAY_MODE.SOLVE
};

let newTestId = -1;

const moveElementInArray = <ElementType>(
  list: ElementType[],
  startIndex: number,
  endIndex: number
): ElementType[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const dragElementInArray = <ElementType>(
  array: ElementType[],
  sourcePosition: number,
  destinationPosition?: number
): ElementType[] | void => {
  // dropped outside the list
  if (destinationPosition === undefined) {
    return;
  }

  return moveElementInArray(array, sourcePosition, destinationPosition);
};

const removeEmptyAnswers = (
  answers: Array<TestSingleAnswer | TestOrderingAnswer | TestMultipleAnswer>
) => {
  return answers.filter(answer => answer.text);
};

const reassignCorrectPositions = (
  answers: TestOrderingAnswer[]
): TestOrderingAnswer[] => {
  return answers.map((answer, position) => ({
    ...answer,
    correctPosition: position
  }));
};

export const testReducer = (
  state = testsInitState,
  { type, payload }: { payload?: any; type: string }
): TestsState => {
  switch (type) {
    case TestActionTypes.TEST_LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case TestActionTypes.TEST_ERROR: {
      const error = (payload as TestErrorPayload).error;
      toast.error(error);
      return {
        ...state,
        error
      };
    }
    case TestActionTypes.EDIT_TEST_TYPE: {
      const { id, type: newType } = payload as EditTestTypePayload;
      const tests = state.tests.map(test => {
        if (test.id === id) {
          switch (newType) {
            case TEST_TYPE.INPUT: {
              test.answers = { correctAnswer: "" };
              break;
            }
            case TEST_TYPE.MULTIPLE:
            case TEST_TYPE.SINGLE:
            case TEST_TYPE.ORDERING: {
              test.answers = [];
              break;
            }
          }
          test.type = newType;
        }
        return test;
      });
      return {
        ...state,
        tests
      };
    }
    case TestActionTypes.EDIT_TEST_QUESTION: {
      const { id, question } = payload as EditTestQuestionPayload;
      const tests = state.tests.map(test => {
        if (test.id === id) {
          test.question = question;
        }
        return test;
      });
      return {
        ...state,
        tests
      };
    }
    case TestActionTypes.EDIT_TEST_ANSWER: {
      const actionPayload = payload as EditTestAnswerPayload;
      const tests = state.tests.map(test => {
        if (test.id === actionPayload.id) {
          switch (test.type) {
            case TEST_TYPE.INPUT: {
              const answers = actionPayload.answer as TestInputAnswer;
              return {
                ...test,
                answers
              };
            }
            case TEST_TYPE.SINGLE: {
              let answers = test.answers as TestSingleAnswer[];
              const updatedAnswerData = actionPayload.answer as TestSingleAnswer;
              if (updatedAnswerData.isCorrect) {
                answers = answers.map(answer => ({
                  ...answer,
                  isCorrect: false
                }));
              }
              if (answers.length <= actionPayload.position!) {
                answers.push({
                  isCorrect: false,
                  text: ""
                });
              }
              _.assign(
                answers[actionPayload.position as number],
                updatedAnswerData
              );
              answers = removeEmptyAnswers(answers);

              return {
                ...test,
                answers
              };
            }
            case TEST_TYPE.MULTIPLE: {
              let answers = test.answers as TestMultipleAnswer[];
              const updatedAnswerData = actionPayload.answer as TestMultipleAnswer;
              if (answers.length <= actionPayload.position!) {
                answers.push({
                  isCorrect: false,
                  text: ""
                });
              }
              _.assign(
                answers[actionPayload.position as number],
                updatedAnswerData
              );
              answers = removeEmptyAnswers(answers);

              return {
                ...test,
                answers
              };
            }
            case TEST_TYPE.ORDERING: {
              let answers = test.answers as TestOrderingAnswer[];
              const updatedAnswerData = actionPayload.answer as TestOrderingAnswer;
              if (answers.length <= actionPayload.position!) {
                answers.push({
                  correctPosition: 0,
                  text: ""
                });
              }
              _.assign(
                answers[actionPayload.position as number],
                updatedAnswerData
              );
              answers = removeEmptyAnswers(answers);
              answers = reassignCorrectPositions(answers);

              return {
                ...test,
                answers
              };
            }
          }
        }
        return test;
      });
      return {
        ...state,
        tests
      };
    }
    case TestActionTypes.REMOVE_TEST_ANSWER: {
      const { id, position } = payload as RemoveTestAnswerPayload;
      const tests = state.tests.map(test => {
        if (test.id === id) {
          (test.answers as
            | TestSingleAnswer[]
            | TestMultipleAnswer[]
            | TestOrderingAnswer[]).splice(position, 1);
        }
        return test;
      });
      return {
        ...state,
        tests
      };
    }
    case TestActionTypes.CHECK_TEST_USER_ANSWERS.SUCCESS: {
      const {
        testsWithCorrectAnswers
      } = payload as CheckTestUserAnswersPayload;
      return {
        ...state,
        tests: testsWithCorrectAnswers,
        displayMode: TEST_DISPLAY_MODE.RESULTS
      };
    }
    case TestActionTypes.REMOVE_TEST: {
      const { id } = payload as RemoveTestPayload;
      const tests = state.tests.filter(test => test.id !== id);
      return {
        ...state,
        tests
      };
    }
    case TestActionTypes.ADD_EMPTY_TEST: {
      const { articleId } = payload as AddEmptyTestPayload;
      const newTest: Test = {
        id: newTestId--,
        type: TEST_TYPE.SINGLE,
        question: "",
        articleId,
        answers: []
      };
      return {
        ...state,
        tests: [...state.tests, newTest]
      };
    }
    case TestActionTypes.MOVE_TEST_ANSWER: {
      const {
        id,
        sourcePosition,
        destinationPosition
      } = payload as MoveTestAnswerPayload;
      const tests = state.tests.map(test => {
        if (test.id === id) {
          let answers = test.answers as TestOrderingAnswer[];
          let resultAnswers = dragElementInArray(
            answers,
            sourcePosition,
            destinationPosition
          );
          if (resultAnswers) {
            resultAnswers = reassignCorrectPositions(resultAnswers);
            test.answers = resultAnswers;
          }
        }
        return test;
      });
      return {
        ...state,
        tests
      };
    }
    case TestActionTypes.EDIT_TEST_USER_ANSWER: {
      const actionPayload = payload as EditTestAnswerPayload;
      const tests = state.tests.map(test => {
        if (test.id === actionPayload.id) {
          switch (test.type) {
            case TEST_TYPE.INPUT: {
              const answers = actionPayload.answer as TestInputAnswer;
              return {
                ...test,
                answers
              };
            }
            case TEST_TYPE.SINGLE: {
              let answers = test.answers as TestSingleAnswer[];
              const updatedAnswerData = actionPayload.answer as TestSingleAnswer;
              if (updatedAnswerData.isCheckedByUser) {
                answers = answers.map(answer => ({
                  ...answer,
                  isCheckedByUser: false
                }));
              }
              _.assign(
                answers[actionPayload.position as number],
                updatedAnswerData
              );

              return {
                ...test,
                answers
              };
            }
            case TEST_TYPE.MULTIPLE: {
              let answers = test.answers as TestMultipleAnswer[];
              const updatedAnswerData = actionPayload.answer as TestMultipleAnswer;
              _.assign(
                answers[actionPayload.position as number],
                updatedAnswerData
              );

              return {
                ...test,
                answers
              };
            }
            case TEST_TYPE.ORDERING: {
              let answers = test.answers as TestOrderingAnswer[];
              const updatedAnswerData = actionPayload.answer as TestOrderingAnswer;
              _.assign(
                answers[actionPayload.position as number],
                updatedAnswerData
              );
              answers = reassignCorrectPositions(answers);

              return {
                ...test,
                answers
              };
            }
          }
        }
        return test;
      });
      return {
        ...state,
        tests
      };
    }
    default:
      return state;
  }
};
