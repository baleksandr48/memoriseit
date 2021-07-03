import React, { FunctionComponent } from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TestInputAnswer } from "../../../../store/test/types";

const useStyles = makeStyles(theme => ({}));

interface Props {
  answer: TestInputAnswer;
  onChange(newAnswer: string): void;
}

export const TestInputAnswerEdit: FunctionComponent<Props> = ({
  answer,
  onChange
}) => {
  const classes = useStyles();

  return (
    <TextField
      fullWidth
      variant={"outlined"}
      value={answer.correctAnswer}
      label={"Correct answer"}
      onChange={event => event.target.value}
    />
  );
};
