import * as React from "react";
import Head from "next/head";
import { NavigationBar } from "../navigation-bar";
import { ReactNode } from "react";
import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { useLayoutStyles } from "./styles";

type LayoutProps = {
  children?: ReactNode | ReactNode[];
  title?: string;
};

export const BaseLayout: React.FunctionComponent<LayoutProps> = ({
  children,
  title
}) => {
  const classes = useLayoutStyles();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavigationBar />
      <Box className={classes.root}>
        <Box className={classes.mainPart}>
          <Box className={classes.childrenContainer}>{children}</Box>
        </Box>
      </Box>
    </>
  );
};
