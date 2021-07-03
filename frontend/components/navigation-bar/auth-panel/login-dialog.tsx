import React, { FunctionComponent, useState } from "react";
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
import { AUTH_DIALOG, AuthErrors } from "../../../store/auth/types";
import { isValidEmail, onNamedElementChange } from "../../../utils";
import { TextFieldPassword } from "../../common/text-field-password";
import Loader from "../../common/loader";
import {
  useChangeAuthTempValueAction,
  useLoginAction,
  useOpenAuthDialogAction,
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

enum ValidationErrors {
  emailIsNotValid,
  passwordsNotValid,
}

interface Props {
  onClose();
}

export const LogInDialog: FunctionComponent<Props> = ({ onClose }) => {
  const [validationError, setValidationError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const loginAction = useLoginAction();
  const changeAuthTempValueAction = useChangeAuthTempValueAction();
  const openAuthDialogAction = useOpenAuthDialogAction();

  const {
    error,
    loading,
    temp: { email, password },
  } = useSelector((store: AppState) => store.authReducer);

  const classes = useStyles();

  const isNotValid = {
    email: validationError === ValidationErrors.emailIsNotValid,
    passwordsNotValid: validationError === ValidationErrors.passwordsNotValid,
  };

  const errorMessage =
    (error === AuthErrors.OTHER && `Something went wrong`) ||
    (error === AuthErrors.USER_NOT_EXIST && `User doesn't exist`) ||
    (error === AuthErrors.LIMIT_EXCEED &&
      `You have reached the message limit, try again later`);

  const onSubmit = () => {
    if (!isValidEmail(email)) {
      setValidationError(ValidationErrors.emailIsNotValid);
      changeAuthTempValueAction({
        password: "",
      });
      return;
    } else {
      setValidationError(null);
      loginAction();
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle className={classes.dialogTitle}>Log in</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {errorMessage && (
              <Typography className={classes.error} children={errorMessage} />
            )}

            <TextField
              fullWidth
              label="Email:"
              type="email"
              variant="outlined"
              value={email}
              onChange={onNamedElementChange(changeAuthTempValueAction)}
              name={"email"}
              size={"small"}
              className={classes.input}
              error={isNotValid.email}
              helperText={isNotValid.email && `Email is not valid.`}
            />
            <TextFieldPassword
              fullWidth
              label="Password:"
              variant="outlined"
              value={password}
              onChange={onNamedElementChange(changeAuthTempValueAction)}
              name={"password"}
              size={"small"}
              classNames={[classes.input]}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            <DialogActions>
              <Button
                onClick={() =>
                  openAuthDialogAction(AUTH_DIALOG.FORGOT_PASSWORD)
                }
              >
                Forgot password
              </Button>
              <Button onClick={onSubmit}>Log in</Button>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
