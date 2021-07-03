import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";
import { Article } from "../../store/article/types";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  title: {
    cursor: "pointer"
  }
}));

interface Props {
  article: Article;
}

export const ArticleItem: FunctionComponent<Props> = ({ article }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Typography variant={"h3"}>{article.title}</Typography>
      <div
        className={"ck-content"}
        dangerouslySetInnerHTML={{ __html: article.text! }}
      />
    </Paper>
  );
};
