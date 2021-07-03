import { useDispatch } from "react-redux";
import {
  TopicActionTypes,
  TopicTableOfContentsToggleIsExpandedPayload,
  TopicDeletePayload,
  TopicTableOfContentsSetSelectedPayload,
  TopicCreatePayload,
  RemoveArticlePayload,
  ContributorAddPayload,
  ContributorRemovePayload
} from "./types";
import { TopicApi } from "../../api/topic-api";
import { useCallback } from "react";
import { ArticleApi } from "../../api/article-api";
import { useRouter } from "next/router";

export function useTopicTableOfContentsToggleIsExpandedAction() {
  const dispatch = useDispatch();
  return (topicId: number, articleId: number) => {
    dispatch({
      type: TopicActionTypes.TOPIC_TABLE_OF_CONTENTS_TOGGLE_IS_EXPANDED,
      payload: {
        topicId,
        articleId
      } as TopicTableOfContentsToggleIsExpandedPayload
    });
  };
}

export function useTopicTableOfContentsSetSelectedAction() {
  const dispatch = useDispatch();
  return (topicId: number, articleId: number) => {
    dispatch({
      type: TopicActionTypes.TOPIC_TABLE_OF_CONTENTS_SET_SELECTED,
      payload: {
        topicId,
        articleId
      } as TopicTableOfContentsSetSelectedPayload
    });
  };
}

export function useDeleteTopicAction() {
  const dispatch = useDispatch();

  return async (topicId: number) => {
    try {
      dispatch({
        type: TopicActionTypes.TOPIC_LOADING
      });

      await TopicApi.deleteTopic(topicId);

      dispatch({
        type: TopicActionTypes.TOPIC_DELETE,
        payload: {
          id: topicId
        } as TopicDeletePayload
      });
    } catch (err) {
      dispatch({
        type: TopicActionTypes.TOPIC_ERROR,
        payload: {
          error: err.message
        }
      });
    }
  };
}

export function useCreateTopicAction() {
  const dispatch = useDispatch();
  return async (name: string) => {
    try {
      dispatch({
        type: TopicActionTypes.TOPIC_LOADING
      });
      const createdTopic = await TopicApi.createTopic({ name });
      dispatch({
        type: TopicActionTypes.TOPIC_CREATE,
        payload: {
          topic: createdTopic
        } as TopicCreatePayload
      });
    } catch (err) {
      dispatch({
        type: TopicActionTypes.TOPIC_ERROR,
        payload: {
          error: err.message
        }
      });
    }
  };
}

export function useRemoveArticleAction() {
  const dispatch = useDispatch();
  return useCallback(
    async (removeArticlePayload: RemoveArticlePayload) => {
      try {
        dispatch({
          type: TopicActionTypes.TOPIC_LOADING
        });
        await ArticleApi.removeArticle(
          removeArticlePayload.topicId,
          removeArticlePayload.articleId
        );
        dispatch({
          type: TopicActionTypes.REMOVE_ARTICLE,
          payload: removeArticlePayload
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

export function useAddContributorAction() {
  const dispatch = useDispatch();
  const router = useRouter();

  return useCallback(
    async (email: string) => {
      try {
        dispatch({
          type: TopicActionTypes.TOPIC_LOADING
        });
        const topicId = parseInt(router.query.topicId as string);
        const contributor = await TopicApi.addContributor(topicId, email);
        dispatch({
          type: TopicActionTypes.CONTRIBUTOR_ADD,
          payload: {
            contributor,
            topicId
          } as ContributorAddPayload
        });
      } catch (err) {
        console.log(err);
        dispatch({
          type: TopicActionTypes.TOPIC_ERROR,
          payload: {
            error: err.message
          }
        });
      }
    },
    [dispatch, router]
  );
}

export function useRemoveContributorAction() {
  const dispatch = useDispatch();
  const router = useRouter();

  return useCallback(
    async (contributorId: number) => {
      try {
        dispatch({
          type: TopicActionTypes.TOPIC_LOADING
        });
        const topicId = parseInt(router.query.topicId as string);
        await TopicApi.removeContributor(topicId, contributorId);
        dispatch({
          type: TopicActionTypes.CONTRIBUTOR_REMOVE,
          payload: {
            contributorId,
            topicId
          } as ContributorRemovePayload
        });
      } catch (err) {
        console.log(err);
        dispatch({
          type: TopicActionTypes.TOPIC_ERROR,
          payload: {
            error: err.message
          }
        });
      }
    },
    [dispatch, router]
  );
}
