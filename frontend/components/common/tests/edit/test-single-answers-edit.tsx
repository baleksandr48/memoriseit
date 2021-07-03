import React, { FunctionComponent } from "react";
import { TextField, IconButton, Radio } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  TestMultipleAnswer,
  TestSingleAnswer
} from "../../../../store/test/types";
import { Delete } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  answers: {
    display: "grid",
    gridTemplateColumns: "25px auto 25px"
  }
}));

interface Props {
  answers: TestMultipleAnswer[];
  onChange(position: number, changes: Partial<TestMultipleAnswer>): void;
  onRemove(position: number): void;
}

const emptyAnswer: TestSingleAnswer = {
  text: "",
  isCorrect: false
};

export const TestSingleAnswersEdit: FunctionComponent<Props> = ({
  answers,
  onChange,
  onRemove
}) => {
  const classes = useStyles();

  const result = [...answers, emptyAnswer].map(
    ({ text, isCorrect = false }, position) => {
      const isLast = answers.length === position;
      return (
        <div className={classes.answers} key={position}>
          <Radio
            checked={isCorrect}
            disabled={isLast}
            onChange={event =>
              onChange(position, {
                isCorrect: event.target.checked
              })
            }
          />
          <TextField
            fullWidth
            value={text}
            name={"text"}
            onChange={event =>
              onChange(position, {
                text: event.target.value
              })
            }
          />
          <IconButton
            aria-label="delete"
            disabled={isLast}
            onClick={() => onRemove(position)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </div>
      );
    }
  );

  return <>{result}</>;
};
