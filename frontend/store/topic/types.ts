import { START_SUCCESS_ERROR } from "../../utils";
import { Article } from "../article/types";
import { Tree } from "../../utils/tree-utils";

export interface TableOfContentsApiOwnFields {
  id: number;
  title: string;
}

export type TableOfContentsApi = Tree<TableOfContentsApiOwnFields>;

export interface TableOfContentsOwnFields extends TableOfContentsApiOwnFields {
  isExpanded: boolean;
  isSelected: boolean;
}

export type TableOfContents = Tree<TableOfContentsOwnFields>;

export enum CONTRIBUTOR_TYPE {
  CREATOR = "CREATOR",
  EDITOR = "EDITOR"
}

export interface User {
  email: string;
  name: string;
}

export interface Contributor {
  id: number;
  user: User;
  type: CONTRIBUTOR_TYPE;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  contributors: Contributor[];
  tableOfContents: TableOfContents;
}

export interface TopicApi extends Omit<Topic, "tableOfContents"> {
  tableOfContents: TableOfContentsApi;
}

//---ACTION_NAMES---
export const TopicActionTypes = {
  GET_CONTRIBUTED_TOPICS: START_SUCCESS_ERROR("GET_CONTRIBUTED_TOPICS"),
  TOPIC_LOADING: "TOPIC_LOADING",
  TOPIC_ERROR: "TOPIC_ERROR",
  TOPIC_TABLE_OF_CONTENTS_TOGGLE_IS_EXPANDED:
    "TOPIC_TABLE_OF_CONTENTS_TOGGLE_IS_EXPANDED",
  TOPIC_TABLE_OF_CONTENTS_SET_SELECTED: "TOPIC_TABLE_OF_CONTENTS_SET_SELECTED",
  ADD_ARTICLE_TO_TOPIC_TABLE_OF_CONTENTS:
    "ADD_ARTICLE_TO_TOPIC_TABLE_OF_CONTENTS",
  TOPIC_DELETE: "TOPIC_DELETE",
  TOPIC_CREATE: "TOPIC_CREATE",
  REMOVE_ARTICLE: "REMOVE_ARTICLE",
  CONTRIBUTOR_ADD: "CONTRIBUTOR_ADD",
  CONTRIBUTOR_REMOVE: "CONTRIBUTOR_REMOVE"
};

//---ACTION_PAYLOADS---
export interface TopicErrorPayload {
  error: string;
}

export interface TopicTableOfContentsToggleIsExpandedPayload {
  topicId: number;
  articleId: number;
}

export interface TopicTableOfContentsSetSelectedPayload {
  topicId: number;
  articleId: number;
}

export interface AddArticleToTopicTableOfContentsPayload {
  article: Article;
}

export interface RemoveArticlePayload {
  articleId: number;
  topicId: number;
}

export interface TopicDeletePayload {
  id: number;
}

export interface TopicCreatePayload {
  topic: Topic;
}

export interface ContributorAddPayload {
  contributor: Contributor;
  topicId: number;
}

export interface ContributorRemovePayload {
  contributorId: number;
  topicId: number;
}

//---OTHER---
export interface TopicState {
  loading: boolean;
  error: string | null;
  topics: Topic[];
}
