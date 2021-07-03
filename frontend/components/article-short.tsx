import React, { FunctionComponent } from "react";
import { Paper, createStyles, Theme, makeStyles } from "@material-ui/core";
import Link from "next/link";
import {Article} from '../store/article/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: "1px solid black",
    },
  })
);

type Props = {
  article: Article;
};

export const ArticleShort: FunctionComponent<Props> = ({ article }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <h2>
        <Link href="/articles/[articleId]" as={`/articles/${article.id}`}>
          {article.title}
        </Link>
      </h2>
      <p>{article.text}</p>
    </Paper>
  );
};
