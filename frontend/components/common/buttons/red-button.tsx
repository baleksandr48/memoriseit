import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { Button, ButtonProps } from "@material-ui/core";

const theme = createMuiTheme({ palette: { primary: red } });

export const RedButton = (props: ButtonProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Button color="primary" {...props} />
    </ThemeProvider>
  );
};
