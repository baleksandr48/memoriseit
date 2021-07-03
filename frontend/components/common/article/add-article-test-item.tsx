import React from "react";
import { Button, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import {
  useAddEmptyTestAction,
  useSaveArticleTestsAction
} from "../../../store/test/hook";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    borderRadius: "20px",
    marginTop: theme.spacing(2),
    backgroundColor: grey["200"],
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    margin: theme.spacing(1)
  }
}));

export const AddArticleTestItem = () => {
  const classes = useStyles();
  const addEmptyTestAction = useAddEmptyTestAction();
  const saveArticleTestsAction = useSaveArticleTestsAction();
  return (
    <Paper className={classes.paper}>
      <Button
        variant={"contained"}
        className={classes.button}
        onClick={addEmptyTestAction}
        color={"primary"}
      >
        + Add test
      </Button>
      <Button
        variant={"contained"}
        className={classes.button}
        onClick={saveArticleTestsAction}
        color={"secondary"}
      >
        Save
      </Button>
    </Paper>
  );
};
