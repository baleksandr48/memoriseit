import { useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  DIALOG_ACTION,
  DIALOG_TYPE,
  DialogContext,
  OpenDialogPayload
} from "./types";

export function useOpenDialogAction() {
  const dispatch = useDispatch();
  return useCallback(
    (type: DIALOG_TYPE, context: DialogContext) =>
      dispatch({
        type: DIALOG_ACTION.OPEN_DIALOG,
        payload: {
          type,
          context
        } as OpenDialogPayload
      }),
    [dispatch]
  );
}

export function useCloseDialogAction() {
  const dispatch = useDispatch();
  return useCallback(
    () =>
      dispatch({
        type: DIALOG_ACTION.CLOSE_DIALOG
      }),
    [dispatch]
  );
}
