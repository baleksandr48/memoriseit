import { START_SUCCESS_ERROR } from "../../utils";

export interface Article {
  id: number;
  title: string;
  text?: string;
  topicId: number;
  parentId?: number;
  isGroup: boolean;
}

//---ACTION_NAMES---
export const ArticleActionTypes = {
  GET_ARTICLE: START_SUCCESS_ERROR("GET_ARTICLE"),
  ARTICLE_LOADING: "ARTICLE_LOADING",
  ARTICLE_ERROR: "ARTICLE_ERROR",
  SELECT_ARTICLE: "SELECT_ARTICLE",
  EDIT_ARTICLE: "EDIT_ARTICLE",
  CLOSE_ARTICLE_EDITOR: "CLOSE_ARTICLE_EDITOR"
};

//---ACTION_PAYLOADS---
export interface ArticleErrorPayload {
  error: string;
}
export interface SelectArticlePayload {
  articleId: number;
}
export interface EditArticlePayload {
  title?: string;
  text?: string;
}

//---OTHER---
export interface ArticleState {
  loading: boolean;
  error: string | null;
  articles: Article[];
  edit: {
    id?: number;
    title: string;
    text: string;
  } | null;
}
