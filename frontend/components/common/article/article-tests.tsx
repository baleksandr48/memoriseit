import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import { TestSolve } from "../tests/solve";
import { TEST_DISPLAY_MODE } from "../../../store/test/types";
import { useCheckAnswersForTestsAction } from "../../../store/test/hook";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    "& > *": {
      marginTop: theme.spacing(1)
    },
    "& > *:first-child": {
      marginTop: 0
    }
  },
  checkAnswersButton: {
    marginTop: theme.spacing(2)
  }
}));

interface Props {}

export const ArticleTests: FunctionComponent<Props> = () => {
  const classes = useStyles();
  const checkAnswersForTestsAction = useCheckAnswersForTestsAction();
  const {
    testReducer: { tests, displayMode }
  } = useSelector((store: AppState) => store);

  if (!tests.length) {
    return null;
  }
  return (
    <Paper className={classes.paper}>
      <Typography variant={"h4"}>Check yourself</Typography>
      {tests.map(test => (
        <TestSolve key={test.id} test={test} displayMode={displayMode} />
      ))}
      {displayMode === TEST_DISPLAY_MODE.SOLVE && (
        <Button
          variant="contained"
          color="secondary"
          className={classes.checkAnswersButton}
          onClick={checkAnswersForTestsAction}
        >
          Check answers
        </Button>
      )}
    </Paper>
  );
};
