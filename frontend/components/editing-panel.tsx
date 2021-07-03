import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core";
import { GreenButton } from "./common/buttons/green-button";
import { RedButton } from "./common/buttons/red-button";
import {
  useCloseArticleEditorAction,
  useSaveEditedArticleAction
} from "../store/article/hook";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    button: {
      color: theme.palette.background.default,
      flexGrow: 1
    }
  })
);

export default function EditingPanel() {
  const classes = useStyles();
  const saveEditedArticleAction = useSaveEditedArticleAction();
  const closeArticleEditorAction = useCloseArticleEditorAction();

  return (
    <div className={classes.root}>
      <RedButton
        onClick={() => closeArticleEditorAction()}
        variant={"contained"}
        className={classes.button}
      >
        Cancel
      </RedButton>
      <GreenButton
        onClick={saveEditedArticleAction}
        variant={"contained"}
        className={classes.button}
      >
        Save changes
      </GreenButton>
    </div>
  );
}
