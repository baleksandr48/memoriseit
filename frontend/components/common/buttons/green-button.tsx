import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import { Button, ButtonProps } from "@material-ui/core";

const theme = createMuiTheme({ palette: { primary: green } });

export const GreenButton = (props: ButtonProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Button color="primary" {...props} />
    </ThemeProvider>
  );
};
