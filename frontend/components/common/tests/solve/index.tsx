import React, { FunctionComponent } from "react";
import {
  Test,
  TEST_DISPLAY_MODE,
  TEST_TYPE,
  TestInputAnswer,
  TestMultipleAnswer,
  TestOrderingAnswer
} from "../../../../store/test/types";
import { TestSingleAnswersSolve } from "./test-single-answers-solve";
import {
  useEditTestUserAnswerAction,
  useMoveTestAnswerAction
} from "../../../../store/test/hook";
import { TestOrderingAnswersSolve } from "./test-ordering-answers-solve";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import { TestInputAnswerSolve } from "./test-input-answer-solve";
import { TestMultipleAnswersSolve } from "./test-multiple-answer-solve";

const useStyles = makeStyles(theme => ({
  testItem: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    borderRadius: "20px",
    backgroundColor: grey["200"],
    "& > *": {
      marginTop: theme.spacing(1)
    },
    "& > *:first-child": {
      marginTop: 0
    }
  }
}));

interface Props {
  test: Test;
  displayMode: TEST_DISPLAY_MODE;
}

export const TestSolve: FunctionComponent<Props> = ({ test, displayMode }) => {
  const moveTestAnswerAction = useMoveTestAnswerAction();
  const editTestUserAnswerAction = useEditTestUserAnswerAction();

  const classes = useStyles();

  let testSolveAnswers;
  switch (test.type) {
    case TEST_TYPE.INPUT:
      testSolveAnswers = (
        <TestInputAnswerSolve
          answer={test.answers as TestInputAnswer}
          displayMode={displayMode}
          onChange={newAnswer =>
            editTestUserAnswerAction({
              id: test.id,
              answer: { userAnswer: newAnswer }
            })
          }
        />
      );
      break;
    case TEST_TYPE.SINGLE:
      testSolveAnswers = (
        <TestSingleAnswersSolve
          answers={test.answers as TestMultipleAnswer[]}
          displayMode={displayMode}
          onChange={(position, changes) =>
            editTestUserAnswerAction({
              id: test.id,
              answer: changes,
              position
            })
          }
        />
      );
      break;
    case TEST_TYPE.MULTIPLE:
      testSolveAnswers = (
        <TestMultipleAnswersSolve
          answers={test.answers as TestMultipleAnswer[]}
          displayMode={displayMode}
          onChange={(position, changes) =>
            editTestUserAnswerAction({
              id: test.id,
              answer: changes,
              position
            })
          }
        />
      );
      break;
    case TEST_TYPE.ORDERING:
      testSolveAnswers = (
        <TestOrderingAnswersSolve
          onMove={(sourcePosition, destinationPosition) =>
            moveTestAnswerAction({
              id: test.id,
              sourcePosition,
              destinationPosition
            })
          }
          answers={test.answers as TestOrderingAnswer[]}
        />
      );
      break;
  }
  return (
    <Paper className={classes.testItem}>
      <Typography variant={"h6"}>{test.question}</Typography>
      {testSolveAnswers}
    </Paper>
  );
};
