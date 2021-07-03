import React, { FunctionComponent } from "react";
import {
  Test,
  TEST_TYPE,
  TestInputAnswer,
  TestMultipleAnswer,
  TestOrderingAnswer
} from "../../../../store/test/types";
import { TestSingleAnswersEdit } from "./test-single-answers-edit";
import {
  useEditTestAnswerAction,
  useEditTestQuestionAction,
  useEditTestTypeAction,
  useMoveTestAnswerAction,
  useRemoveTestAction,
  useRemoveTestAnswerAction
} from "../../../../store/test/hook";
import { TestOrderingAnswersEdit } from "./test-ordering-answers-edit";
import { IconButton, Paper } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { TestTypeSelect } from "./test-type-select";
import { makeStyles } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import { TestQuestionInput } from "./test-question-input";
import { TestInputAnswerEdit } from "./test-input-answer-edit";
import { TestMultipleAnswersEdit } from "./test-multiple-answer-edit";

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
  },
  removeTestBtn: {
    alignSelf: "flex-end"
  }
}));

interface Props {
  test: Test;
}

export const TestEdit: FunctionComponent<Props> = ({ test }) => {
  const editTestTypeAction = useEditTestTypeAction();
  const editTestQuestionAction = useEditTestQuestionAction();
  const editTestAnswerAction = useEditTestAnswerAction();
  const removeTestAnswerAction = useRemoveTestAnswerAction();
  const removeTestAction = useRemoveTestAction();
  const moveTestAnswerAction = useMoveTestAnswerAction();

  const classes = useStyles();

  let testEdit;
  switch (test.type) {
    case TEST_TYPE.INPUT:
      testEdit = (
        <TestInputAnswerEdit
          answer={test.answers as TestInputAnswer}
          onChange={newAnswer =>
            editTestAnswerAction({
              id: test.id,
              answer: { correctAnswer: newAnswer }
            })
          }
        />
      );
      break;
    case TEST_TYPE.SINGLE:
      testEdit = (
        <TestSingleAnswersEdit
          answers={test.answers as TestMultipleAnswer[]}
          onChange={(position, changes) =>
            editTestAnswerAction({
              id: test.id,
              answer: changes,
              position
            })
          }
          onRemove={position =>
            removeTestAnswerAction({ id: test.id, position })
          }
        />
      );
      break;
    case TEST_TYPE.MULTIPLE:
      testEdit = (
        <TestMultipleAnswersEdit
          answers={test.answers as TestMultipleAnswer[]}
          onChange={(position, changes) =>
            editTestAnswerAction({
              id: test.id,
              answer: changes,
              position
            })
          }
          onRemove={position =>
            removeTestAnswerAction({ id: test.id, position })
          }
        />
      );
      break;
    case TEST_TYPE.ORDERING:
      testEdit = (
        <TestOrderingAnswersEdit
          onRemove={position =>
            removeTestAnswerAction({
              id: test.id,
              position
            })
          }
          onChange={(position, changes) =>
            editTestAnswerAction({
              id: test.id,
              position,
              answer: changes
            })
          }
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
      <IconButton
        aria-label="delete"
        className={classes.removeTestBtn}
        size={"small"}
        onClick={() => removeTestAction({ id: test.id })}
      >
        <Cancel />
      </IconButton>
      <TestTypeSelect
        value={test.type}
        onChange={type => editTestTypeAction({ id: test.id, type })}
      />
      <TestQuestionInput
        question={test.question}
        onChange={newQuestion =>
          editTestQuestionAction({ id: test.id, question: newQuestion })
        }
      />
      {testEdit}
    </Paper>
  );
};
