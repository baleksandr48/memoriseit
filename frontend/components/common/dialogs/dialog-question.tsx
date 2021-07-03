import React, { FunctionComponent } from "react";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme
} from "@material-ui/core";
import { useDialogStyles } from "./styles";

interface Props {
  open: boolean;
  title: string;
  onSubmit(): any;
  onClose(): any;
}

export const DialogQuestion: FunctionComponent<Props> = ({
  open,
  onClose,
  title,
  onSubmit
}) => {
  const classes = useDialogStyles();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogActions>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
