import { DIALOG_ACTION, DialogState, OpenDialogPayload } from "./types";

export const dialogInitState: DialogState = {};

export const dialogReducer = (
  state = dialogInitState,
  action: any
): DialogState => {
  switch (action.type) {
    case DIALOG_ACTION.OPEN_DIALOG: {
      const { context, type: openedType } = action.payload as OpenDialogPayload;
      return {
        ...state,
        openedType,
        context
      };
    }
    case DIALOG_ACTION.CLOSE_DIALOG: {
      return {
        ...state,
        openedType: undefined,
        context: undefined
      };
    }
    default:
      return state;
  }
};
