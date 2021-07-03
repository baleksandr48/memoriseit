import React, { FunctionComponent } from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  TEST_DISPLAY_MODE,
  TestInputAnswer
} from "../../../../store/test/types";

const useStyles = makeStyles(theme => ({}));

interface Props {
  answer: TestInputAnswer;
  onChange(newAnswer: string): void;
  displayMode: TEST_DISPLAY_MODE;
}

export const TestInputAnswerSolve: FunctionComponent<Props> = ({
  answer,
  onChange,
  displayMode
}) => {
  const classes = useStyles();

  let correctAnswer = null;
  if (
    displayMode === TEST_DISPLAY_MODE.RESULTS &&
    answer.userAnswer !== answer.correctAnswer
  ) {
    correctAnswer = (
      <TextField
        fullWidth
        disabled
        variant={"outlined"}
        value={answer.correctAnswer}
        label={"Correct answer"}
      />
    );
  }
  const userAnswer = (
    <TextField
      fullWidth
      disabled={displayMode === TEST_DISPLAY_MODE.RESULTS}
      variant={"outlined"}
      value={answer.userAnswer || ""}
      label={"Your answer"}
      onChange={event => onChange(event.target.value)}
    />
  );
  return (
    <>
      {userAnswer}
      {correctAnswer}
    </>
  );
};
