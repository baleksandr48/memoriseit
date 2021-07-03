import update from "immutability-helper";
import {
  AddArticleToTopicTableOfContentsPayload,
  TopicActionTypes,
  TopicErrorPayload,
  TopicState,
  TopicTableOfContentsSetSelectedPayload,
  TopicTableOfContentsToggleIsExpandedPayload,
  TopicDeletePayload,
  TopicCreatePayload,
  RemoveArticlePayload,
  TableOfContents,
  ContributorAddPayload,
  ContributorRemovePayload
} from "./types";
import { findTree, forEachTree } from "../../utils/tree-utils";
import { TestErrorPayload } from "../test/types";
import { toast } from "react-toastify";

export const topicInitState: TopicState = {
  error: null,
  loading: false,
  topics: []
};

export const topicReducer = (
  state = topicInitState,
  { type, payload }: { payload?: object; type: string }
): TopicState => {
  switch (type) {
    case TopicActionTypes.TOPIC_LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case TopicActionTypes.TOPIC_ERROR: {
      const error = (payload as TopicErrorPayload).error;
      toast.error(error);
      return {
        ...state,
        error
      };
    }
    case TopicActionTypes.CONTRIBUTOR_ADD: {
      const { contributor, topicId } = payload as ContributorAddPayload;
      const topic = state.topics.find(topic => topic.id === topicId);
      if (!topic) {
        return state;
      }
      topic.contributors.push(contributor);
      return { ...state };
    }
    case TopicActionTypes.CONTRIBUTOR_REMOVE: {
      const { contributorId, topicId } = payload as ContributorRemovePayload;
      const topic = state.topics.find(topic => topic.id === topicId);
      if (!topic) {
        return state;
      }
      topic.contributors = topic.contributors.filter(
        contributor => contributor.id !== contributorId
      );
      return { ...state };
    }
    case TopicActionTypes.TOPIC_TABLE_OF_CONTENTS_TOGGLE_IS_EXPANDED: {
      const {
        topicId,
        articleId
      } = payload as TopicTableOfContentsToggleIsExpandedPayload;

      const topics = state.topics.map(topic => {
        if (topic.id === topicId) {
          let tableOfContentsItem = findTree(
            topic.tableOfContents,
            el => el.id === articleId
          );
          if (tableOfContentsItem) {
            tableOfContentsItem.isExpanded = !tableOfContentsItem.isExpanded;
          }
        }
        return topic;
      });
      return {
        ...state,
        topics
      };
    }
    case TopicActionTypes.TOPIC_TABLE_OF_CONTENTS_SET_SELECTED: {
      const {
        topicId,
        articleId
      } = payload as TopicTableOfContentsSetSelectedPayload;

      const topics = state.topics.map(topic => {
        if (topic.id === topicId) {
          forEachTree(topic.tableOfContents, el => {
            el.id === articleId
              ? (el.isSelected = true)
              : (el.isSelected = false);
          });
        }
        return topic;
      });
      return {
        ...state,
        topics
      };
    }
    case TopicActionTypes.ADD_ARTICLE_TO_TOPIC_TABLE_OF_CONTENTS: {
      const { article } = payload as AddArticleToTopicTableOfContentsPayload;
      const [topic] = state.topics;
      let parentItem = findTree(
        topic.tableOfContents,
        el => el.id === article.parentId
      );
      const newTableOfContents = {
        id: article.id,
        title: article.title,
        isExpanded: false,
        children: article.isGroup ? [] : undefined,
        isSelected: false
      };
      if (parentItem) {
        parentItem.isExpanded = true;
        parentItem.children?.push(newTableOfContents);
      } else {
        if (!topic.tableOfContents.children) {
          topic.tableOfContents.children = [];
        }
        topic.tableOfContents.children.push(newTableOfContents);
      }
      return {
        ...state,
        topics: [
          {
            ...topic,
            tableOfContents: { ...topic.tableOfContents }
          }
        ]
      };
    }
    case TopicActionTypes.REMOVE_ARTICLE: {
      const { articleId } = payload as RemoveArticlePayload;
      const [topic] = state.topics;

      const removeElementFromTree = (
        tableOfContents: TableOfContents,
        id: number
      ): TableOfContents | void => {
        if (tableOfContents.id === id) {
          return;
        }
        const result = {
          ...tableOfContents
        };
        if (tableOfContents.children) {
          result.children = tableOfContents.children.reduce(
            (acc: TableOfContents[], el) => {
              const child = removeElementFromTree(el, id);
              if (child) {
                acc.push(child);
              }
              return acc;
            },
            []
          );
        }
        return result;
      };
      const tableOfContents = removeElementFromTree(
        topic.tableOfContents,
        articleId
      );
      if (!tableOfContents) {
        return state;
      }
      return {
        ...state,
        topics: [
          {
            ...topic,
            tableOfContents
          }
        ]
      };
    }
    case TopicActionTypes.TOPIC_DELETE: {
      const { id: topicId } = payload as TopicDeletePayload;

      return update(state, {
        topics: {
          $set: state.topics.filter(t => t.id !== topicId)
        }
      });
    }
    case TopicActionTypes.TOPIC_CREATE: {
      const { topic } = payload as TopicCreatePayload;
      return {
        ...state,
        topics: [...state.topics, topic]
      };
    }
    default:
      return state;
  }
};
