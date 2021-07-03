import { ActionTypes, AuthActionPayloads } from "../store/auth/types";

export interface Action<Type, Payload = undefined> {
  type: Type;
  payload?: Payload;
}

export function action<PayloadType extends AuthActionPayloads = undefined>(
  type: ActionTypes
) {
  return function (payload?: PayloadType): Action<ActionTypes, PayloadType> {
    return {
      type,
      payload,
    };
  };
}

export const START_SUCCESS_ERROR = (prefix: string) => ({
  MAIN: prefix,
  START: `${prefix}_START`,
  SUCCESS: `${prefix}_SUCCESS`,
  ERROR: `${prefix}_ERROR`,
});
