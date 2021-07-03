import React, { FunctionComponent } from "react";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import Loader from "../../common/loader";
import { useLogoutAction } from "../../../store/auth/hook";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogTitle: {
      backgroundColor: theme.palette.background.default,
    },
    dialogContent: {
      backgroundColor: theme.palette.background.default,
    },
    input: {
      marginTop: theme.spacing(2),
    },
    error: {
      padding: theme.spacing(1),
      color: theme.palette.common.white,
      backgroundColor: theme.palette.error.main,
      borderRadius: 8,
    },
  })
);

interface Props {
  onClose();
}

export const LogoutDialog: FunctionComponent<Props> = ({ onClose }) => {
  const classes = useStyles();
  const logoutAction = useLogoutAction();
  const { loading } = useSelector((store: AppState) => store.authReducer);

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle className={classes.dialogTitle}>Logout</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Typography>Are you sure that you want to log out?</Typography>
            <DialogActions>
              <Button onClick={logoutAction}>Logout</Button>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
