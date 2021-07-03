import React, { FunctionComponent, useState } from "react";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  Theme
} from "@material-ui/core";
import { useDialogStyles } from "./styles";

interface Props {
  open: boolean;
  title: string;
  inputLabel: string;
  onSubmit(result: string): any;
  onClose(): any;
}

export const DialogInput: FunctionComponent<Props> = ({
  open,
  onClose,
  title,
  inputLabel,
  onSubmit
}) => {
  const classes = useDialogStyles();
  const [input, setInput] = useState<HTMLInputElement | null>(null);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          fullWidth
          autoFocus
          label={inputLabel}
          variant="outlined"
          size={"small"}
          className={classes.input}
          inputRef={setInput}
        />
        <DialogActions>
          <Button onClick={() => onSubmit(input!.value)}>Submit</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
