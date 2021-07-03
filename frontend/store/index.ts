import { combineReducers, compose, createStore } from "redux";
import { authInitState, authReducer } from "./auth/reducer";
import { articleInitState, articleReducer } from "./article/reducer";
import { testsInitState, testReducer } from "./test/reducer";
import { useMemo } from "react";
import * as _ from "lodash";
import { topicInitState, topicReducer } from "./topic/reducer";
import { dialogInitState, dialogReducer } from "./dialog/reducer";
import { DeepPartial } from "../utils/types";

const rootReducer = combineReducers({
  authReducer,
  articleReducer,
  testReducer,
  topicReducer,
  dialogReducer
});
export type AppState = ReturnType<typeof rootReducer>;

const rootInitState: AppState = {
  articleReducer: articleInitState,
  authReducer: authInitState,
  testReducer: testsInitState,
  topicReducer: topicInitState,
  dialogReducer: dialogInitState
};

export const initializeStore = (partialInitialState: DeepPartial<AppState>) => {
  const composeEnhancers =
    (typeof window !== "undefined" &&
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;
  return createStore(
    rootReducer,
    _.merge({}, rootInitState, partialInitialState),
    composeEnhancers()
  );
};

export function useStore(partialInitialState: DeepPartial<AppState>) {
  return useMemo(() => initializeStore(partialInitialState), [
    partialInitialState
  ]);
}
