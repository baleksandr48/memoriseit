import _ from "lodash";
import {
  ArticleActionTypes,
  ArticleErrorPayload,
  ArticleState,
  EditArticlePayload
} from "./types";
import { LoginErrorPayload } from "../auth/types";
import { toast } from "react-toastify";

export const articleInitState: ArticleState = {
  error: null,
  loading: false,
  articles: [],
  edit: null
};

export const articleReducer = (
  state = articleInitState,
  { type, payload }: { payload?: object; type: string }
): ArticleState => {
  switch (type) {
    case ArticleActionTypes.ARTICLE_LOADING: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case ArticleActionTypes.ARTICLE_ERROR: {
      const error = (payload as ArticleErrorPayload).error;
      toast.error(error);
      return {
        ...state,
        loading: false,
        error
      };
    }
    case ArticleActionTypes.EDIT_ARTICLE: {
      const { text, title } = payload as EditArticlePayload;
      const edit = _.merge({}, state.edit, { text, title });
      return {
        ...state,
        edit
      };
    }
    case ArticleActionTypes.CLOSE_ARTICLE_EDITOR: {
      return {
        ...state,
        edit: null,
        error: null,
        loading: false
      };
    }
    default:
      return state;
  }
};
