import React, { FC } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import {
  DIALOG_TYPE,
  SIMPLE_DIALOG_TYPE,
  SimpleDialogContext
} from "../../../store/dialog/types";
import { DialogInput } from "./dialog-input";
import { useCloseDialogAction } from "../../../store/dialog/hook";
import { RecentActors } from "@material-ui/icons";
import { DialogQuestion } from "./dialog-question";

export const SimpleDialog: FC = () => {
  const {
    dialogReducer: { openedType, context = {} }
  } = useSelector((store: AppState) => store);
  const closeDialogAction = useCloseDialogAction();
  const {
    inputLabel,
    onSubmit,
    title,
    type,
    question
  } = context as SimpleDialogContext;
  return (
    <React.Fragment>
      <DialogInput
        open={
          openedType === DIALOG_TYPE.SIMPLE_DIALOG &&
          type === SIMPLE_DIALOG_TYPE.INPUT
        }
        onClose={closeDialogAction}
        title={title}
        inputLabel={inputLabel!}
        onSubmit={(result: string) => {
          closeDialogAction();
          onSubmit(result);
        }}
      />
      <DialogQuestion
        open={
          openedType === DIALOG_TYPE.SIMPLE_DIALOG &&
          type === SIMPLE_DIALOG_TYPE.QUESTION
        }
        onClose={closeDialogAction}
        title={title}
        onSubmit={() => {
          closeDialogAction();
          onSubmit();
        }}
      />
    </React.Fragment>
  );
};
