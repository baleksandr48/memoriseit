import { useDispatch } from "react-redux";
import { useCallback } from "react";

export function useReduxAction<PayloadType = void>(type: string | object) {
  const dispatch = useDispatch();
  return useCallback(
    (payload: PayloadType) =>
      dispatch({
        type,
        payload
      }),
    [dispatch]
  );
}
