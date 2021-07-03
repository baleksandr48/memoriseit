import React, { FunctionComponent } from "react";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import { AuthErrors } from "../../../store/auth/types";
import { onNamedElementChange } from "../../../utils";
import Loader from "../../common/loader";
import moment from "moment";
import { CountDownButton } from "../../common/countdown-button";
import {
  useChangeAuthTempValueAction,
  useConfirmAccountAction,
  useResendConfirmAccountAction,
} from "../../../store/auth/hook";

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

export const ConfirmAccountDialog: FunctionComponent<Props> = ({ onClose }) => {
  const {
    error,
    loading,
    temp: { email, confirmationCode },
    lastTimeResendConfirmation,
  } = useSelector((store: AppState) => store.authReducer);
  const confirmAccountAction = useConfirmAccountAction();
  const resendConfirmAccountAction = useResendConfirmAccountAction();
  const changeAuthTempValueAction = useChangeAuthTempValueAction();
  const classes = useStyles();

  let errorMessage;
  if (error) {
    errorMessage =
      (error === AuthErrors.LIMIT_EXCEED &&
        `You have reached the message limit, try again later`) ||
      (error === AuthErrors.CODE_MISMATCH_EXCEPTION &&
        `The code is not correct`) ||
      `Something went wrong.`;
  }

  const targetTimestamp = lastTimeResendConfirmation
    ? moment.unix(lastTimeResendConfirmation).add(10, "second").unix()
    : null;

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle className={classes.dialogTitle}>Confirm email</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {errorMessage && (
              <Typography className={classes.error} children={errorMessage} />
            )}
            <Typography>
              Confirmation code was sent to email <b>{email}</b> Use it to
              confirm your account
            </Typography>
            <TextField
              fullWidth
              label="Confirmation code:"
              type="text"
              variant="outlined"
              name={"confirmationCode"}
              value={confirmationCode}
              onChange={onNamedElementChange(changeAuthTempValueAction)}
              size={"small"}
              className={classes.input}
            />
            <DialogActions>
              <CountDownButton
                disabledUntil={targetTimestamp}
                disabledPrefix={`Resend in`}
                onClick={resendConfirmAccountAction}
                value={"Resend code"}
              />
              <Button onClick={confirmAccountAction}>Confirm</Button>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
