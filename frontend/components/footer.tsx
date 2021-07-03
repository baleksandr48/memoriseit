import React from "react";
import { Paper, createStyles, Theme, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.secondary.dark,
      padding: 20,
    },
  })
);

export default function Footer() {
  const classes = useStyles();

  return <Paper className={classes.root}>footer</Paper>;
}
