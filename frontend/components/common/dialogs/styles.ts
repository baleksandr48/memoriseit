import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useDialogStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogTitle: {
      backgroundColor: theme.palette.background.default
    },
    dialogContent: {
      backgroundColor: theme.palette.background.default
    },
    input: {
      marginTop: theme.spacing(2)
    },
    error: {
      padding: theme.spacing(1),
      color: theme.palette.common.white,
      backgroundColor: theme.palette.error.main,
      borderRadius: 8
    }
  })
);
