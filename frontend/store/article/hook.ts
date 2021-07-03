import { useReduxAction } from "../../utils/hooks";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../index";
import { ArticleActionTypes, EditArticlePayload } from "./types";
import {
  AddArticleToTopicTableOfContentsPayload,
  TopicActionTypes
} from "../topic/types";
import { useCallback } from "react";
import { ArticleApi } from "../../api/article-api";

export function useRedirectArticlePageAction() {
  const router = useRouter();
  return (
    articleId: string | number,
    topicId: string | number = router.query.topicId as string
  ) => {
    router.push(
      `/topics/[topicId]/[articleId]`,
      `/topics/${topicId}/${articleId}`
    );
  };
}

export function useRedirectArticleEditPageAction() {
  const router = useRouter();
  return (
    articleId: number | string,
    topicId: number | string = router.query.topicId as string
  ) => {
    router.push(
      `/topics/[topicId]/[articleId]/edit`,
      `/topics/${topicId}/${articleId}/edit`
    );
  };
}

export function useRedirectArticleTestsEditPageAction() {
  const router = useRouter();
  return (
    articleId: number | string,
    topicId: number | string = router.query.topicId as string
  ) => {
    router.push(
      `/topics/[topicId]/[articleId]/edit-tests`,
      `/topics/${topicId}/${articleId}/edit-tests`
    );
  };
}

export function useRedirectArticleCreatePageAction() {
  const router = useRouter();
  return (
    articleId: number | string,
    topicId: number | string = router.query.topicId as string
  ) => {
    router.push(
      `/topics/[topicId]/[articleId]/add`,
      `/topics/${topicId}/${articleId}/add`
    );
  };
}

export function useCreateEmptyArticleAction() {
  const dispatch = useDispatch();
  return useCallback(
    async (articleCreate: {
      title: string;
      isGroup: boolean;
      topicId: number;
      parentId?: number;
    }) => {
      try {
        dispatch({
          type: TopicActionTypes.TOPIC_LOADING
        });
        const createdArticle = await ArticleApi.createArticle(
          articleCreate.topicId,
          articleCreate
        );
        dispatch({
          type: TopicActionTypes.ADD_ARTICLE_TO_TOPIC_TABLE_OF_CONTENTS,
          payload: {
            article: createdArticle
          } as AddArticleToTopicTableOfContentsPayload
        });
      } catch (err) {
        dispatch({
          type: TopicActionTypes.TOPIC_ERROR,
          payload: {
            error: err.message
          }
        });
      }
    },
    [dispatch]
  );
}

export function useCloseArticleEditorAction() {
  const router = useRouter();
  const closeArticleEditorAction = useReduxAction(
    ArticleActionTypes.CLOSE_ARTICLE_EDITOR
  );
  let defaultAs = `/topics/${router.query.topicId}/${router.query.articleId}/`;
  return (as = defaultAs, url = `/topics/[topicId]/[articleId]`) => {
    closeArticleEditorAction();
    router.push(url, as);
  };
}

export function useSaveEditedArticleAction() {
  const closeArticleEditorAction = useCloseArticleEditorAction();
  const dispatch = useDispatch();
  const {
    articles: [article],
    edit
  } = useSelector((state: AppState) => state.articleReducer);
  return useCallback(async () => {
    if (!edit) {
      return;
    }
    try {
      dispatch({
        type: ArticleActionTypes.ARTICLE_LOADING
      });
      await ArticleApi.updateArticle(article.topicId, edit.id!, {
        text: edit.text,
        title: edit.title
      });
      closeArticleEditorAction(
        `/topics/${article.topicId}`,
        `/topics/[topicId]`
      );
    } catch (err) {
      dispatch({
        type: ArticleActionTypes.ARTICLE_ERROR,
        payload: {
          error: err.message
        }
      });
    }
  }, [dispatch, article, edit]);
}

export function useEditArticleAction() {
  return useReduxAction<EditArticlePayload>(ArticleActionTypes.EDIT_ARTICLE);
}
