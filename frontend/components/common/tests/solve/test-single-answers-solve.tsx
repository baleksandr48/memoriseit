import React, { FunctionComponent } from "react";
import { Radio, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  TEST_DISPLAY_MODE,
  TestMultipleAnswer
} from "../../../../store/test/types";
import { green, red } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  answer: {
    display: "grid",
    gridTemplateColumns: "25px auto"
  },
  answerText: {
    lineHeight: 2.5
  },
  rightAnswers: {
    borderRadius: "20px",
    border: "3px solid",
    borderColor: green[200]
  },
  wrongAnswers: {
    borderRadius: "20px",
    border: "3px solid",
    borderColor: red[200]
  }
}));

interface Props {
  answers: TestMultipleAnswer[];
  onChange(
    position: number,
    changes: Pick<TestMultipleAnswer, "isCheckedByUser">
  ): void;
  displayMode: TEST_DISPLAY_MODE;
}

export const TestSingleAnswersSolve: FunctionComponent<Props> = ({
  answers,
  onChange,
  displayMode
}) => {
  const classes = useStyles();
  const result = answers.map(
    ({ text, isCheckedByUser = false, isCorrect }, position) => {
      let answerClasses = [classes.answer];
      if (displayMode === TEST_DISPLAY_MODE.RESULTS) {
        if (isCorrect) {
          answerClasses.push(classes.rightAnswers);
        }
        if (!isCorrect && isCheckedByUser) {
          answerClasses.push(classes.wrongAnswers);
        }
      }
      return (
        <div className={answerClasses.join(" ")} key={position}>
          <Radio
            checked={isCheckedByUser}
            disabled={displayMode === TEST_DISPLAY_MODE.RESULTS}
            onChange={event =>
              onChange(position, {
                isCheckedByUser: event.target.checked
              })
            }
          />
          <Typography className={classes.answerText}>{text}</Typography>
        </div>
      );
    }
  );

  return <>{result}</>;
};
