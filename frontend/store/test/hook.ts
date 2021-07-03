import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  CheckTestUserAnswersPayload,
  EditTestAnswerPayload,
  EditTestQuestionPayload,
  EditTestTypePayload,
  EditTestUserAnswersPayload,
  MoveTestAnswerPayload,
  RemoveTestAnswerPayload,
  RemoveTestPayload,
  Test,
  TestActionTypes
} from "./types";
import { useRouter } from "next/router";
import { AppState } from "../index";
import * as _ from "lodash";
import { TestApi } from "../../api/test-api";

export function useAddEmptyTestAction() {
  const dispatch = useDispatch();
  const router = useRouter();

  return useCallback(
    () =>
      dispatch({
        type: TestActionTypes.ADD_EMPTY_TEST,
        payload: {
          articleId: Number.parseInt(router.query.articleId as string)
        }
      }),
    [dispatch]
  );
}

const removeNegativeIds = (tests: Test[]) => {
  return tests.map(test => {
    if (test.id < 0) {
      delete test.id;
    }
    return test;
  });
};

export function useSaveArticleTestsAction() {
  const dispatch = useDispatch();
  const router = useRouter();
  let { tests } = useSelector((state: AppState) => state.testReducer);
  return async () => {
    try {
      dispatch({
        type: TestActionTypes.TEST_LOADING
      });
      tests = removeNegativeIds(tests);

      await TestApi.saveArticleTests(
        router.query.topicId as string,
        router.query.articleId as string,
        tests
      );

      await router.push(`/topics/[topicId]`, `/topics/${router.query.topicId}`);
    } catch (err) {
      dispatch({
        type: TestActionTypes.TEST_ERROR,
        payload: {
          error: err.message
        }
      });
    }
  };
}

export function useEditTestTypeAction() {
  const dispatch = useDispatch();
  return useCallback(
    (payload: EditTestTypePayload) =>
      dispatch({
        type: TestActionTypes.EDIT_TEST_TYPE,
        payload
      }),
    [dispatch]
  );
}

export function useEditTestQuestionAction() {
  const dispatch = useDispatch();
  return useCallback(
    (payload: EditTestQuestionPayload) =>
      dispatch({
        type: TestActionTypes.EDIT_TEST_QUESTION,
        payload
      }),
    [dispatch]
  );
}

export function useEditTestAnswerAction() {
  const dispatch = useDispatch();
  return useCallback(
    (payload: EditTestAnswerPayload) =>
      dispatch({
        type: TestActionTypes.EDIT_TEST_ANSWER,
        payload
      }),
    [dispatch]
  );
}

export function useEditTestUserAnswerAction() {
  const dispatch = useDispatch();
  return useCallback(
    (payload: EditTestUserAnswersPayload) =>
      dispatch({
        type: TestActionTypes.EDIT_TEST_USER_ANSWER,
        payload
      }),
    [dispatch]
  );
}

export function useRemoveTestAnswerAction() {
  const dispatch = useDispatch();
  return useCallback(
    (payload: RemoveTestAnswerPayload) =>
      dispatch({
        type: TestActionTypes.REMOVE_TEST_ANSWER,
        payload
      }),
    [dispatch]
  );
}

export function useRemoveTestAction() {
  const dispatch = useDispatch();
  return useCallback(
    (payload: RemoveTestPayload) =>
      dispatch({
        type: TestActionTypes.REMOVE_TEST,
        payload
      }),
    [dispatch]
  );
}

export function useMoveTestAnswerAction() {
  const dispatch = useDispatch();
  return useCallback(
    (payload: MoveTestAnswerPayload) =>
      dispatch({
        type: TestActionTypes.MOVE_TEST_ANSWER,
        payload
      }),
    [dispatch]
  );
}

export function useCheckAnswersForTestsAction() {
  const dispatch = useDispatch();
  const router = useRouter();
  let { tests } = useSelector((state: AppState) => state.testReducer);
  return async () => {
    try {
      dispatch({
        type: TestActionTypes.TEST_LOADING
      });

      // @ts-ignore
      const testsWithCorrectAnswers: Test[] = await TestApi.checkAnswersForTests(
        router.query.topicId as string,
        router.query.articleId as string,
        // @ts-ignore
        tests.map(test => _.pick(test, ["id", "answers", "type"]))
      );
      dispatch({
        type: TestActionTypes.CHECK_TEST_USER_ANSWERS.SUCCESS,
        payload: {
          testsWithCorrectAnswers
        } as CheckTestUserAnswersPayload
      });
    } catch (err) {
      dispatch({
        type: TestActionTypes.TEST_ERROR,
        payload: {
          error: err.message
        }
      });
    }
  };
}
