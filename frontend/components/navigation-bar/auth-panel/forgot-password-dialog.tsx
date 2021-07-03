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
import {
  isValidEmail,
  isValidPassword,
  onNamedElementChange,
} from "../../../utils";
import { TextFieldPassword } from "../../common/text-field-password";
import Loader from "../../common/loader";
import {
  useChangeAuthTempValueAction,
  useOpenAuthDialogAction,
  useSendEmailForgotPasswordAction,
  useUpdatePasswordAction,
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
  passwordsNotEqual,
  passwordsNotValid,
  codeNotValid,
}

interface Props {
  onClose();
}

export const ForgotPasswordDialog: FunctionComponent<Props> = ({ onClose }) => {
  const [validationError, setValidationError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    error,
    loading,
    resetPassIsDone,
    temp: {
      resetPassCodeSentTo,
      confirmationCode,
      repeatPassword,
      password,
      email,
    },
  } = useSelector((store: AppState) => store.authReducer);
  const sendEmailForgotPasswordAction = useSendEmailForgotPasswordAction();
  const updatePasswordAction = useUpdatePasswordAction();
  const changeAuthTempValueAction = useChangeAuthTempValueAction();
  const openAuthDialogAction = useOpenAuthDialogAction();
  const classes = useStyles();

  const isNotValid = {
    email: validationError === ValidationErrors.emailIsNotValid,
    passwordsNotEqual: validationError === ValidationErrors.passwordsNotEqual,
    passwordsNotValid: validationError === ValidationErrors.passwordsNotValid,
    codeNotValid: validationError === ValidationErrors.codeNotValid,
  };

  const errorMessage =
    (error === AuthErrors.OTHER && `Something went wrong`) ||
    (error === AuthErrors.LIMIT_EXCEED &&
      `You have exceeded the limit, try again later`) ||
    (error === AuthErrors.CONFIRMATION_CODE_IS_WRONG &&
      `Confirmation code is wrong`) ||
    (error === AuthErrors.USER_NOT_EXIST && `User doesn't exists`) ||
    (error === AuthErrors.CODE_MISMATCH_EXCEPTION && `Code is wrong`);

  const resetFields = () => {
    changeAuthTempValueAction({
      password: "",
      repeatPassword: "",
      confirmationCode: "",
    });
  };

  const onSendCode = () => {
    if (!isValidEmail(email)) {
      return setValidationError(ValidationErrors.emailIsNotValid);
    }
    setValidationError(null);
    sendEmailForgotPasswordAction();
  };

  const onUpdatePassword = () => {
    if (password !== repeatPassword) {
      setValidationError(ValidationErrors.passwordsNotEqual);
      return resetFields();
    } else if (!isValidPassword(password)) {
      setValidationError(ValidationErrors.passwordsNotValid);
      return resetFields();
    } else if (!confirmationCode) {
      setValidationError(ValidationErrors.codeNotValid);
      return resetFields();
    } else {
      setValidationError(null);
    }
    updatePasswordAction();
  };

  const onBackToLogin = () => {
    openAuthDialogAction(AUTH_DIALOG.LOGIN);
  };

  let content;
  if (loading) {
    content = <Loader />;
  } else if (resetPassIsDone) {
    content = (
      <>
        <Typography>
          Password for <b>{email}</b> is successfully updated.
        </Typography>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={onBackToLogin}>Back to login</Button>
        </DialogActions>
      </>
    );
  } else if (!resetPassCodeSentTo) {
    content = (
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
          name={"email"}
          onChange={onNamedElementChange(changeAuthTempValueAction)}
          size={"small"}
          className={classes.input}
          error={isNotValid.email}
          helperText={isNotValid.email && `Email is not valid.`}
        />
        <DialogActions>
          <Button onClick={onSendCode}>Send code</Button>
        </DialogActions>
      </>
    );
  } else {
    content = (
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
          size={"small"}
          className={classes.input}
          disabled
        />
        <TextField
          fullWidth
          label="Code:"
          type="text"
          variant="outlined"
          value={confirmationCode}
          name={"confirmationCode"}
          onChange={onNamedElementChange(changeAuthTempValueAction)}
          size={"small"}
          className={classes.input}
          error={isNotValid.codeNotValid}
          helperText={isNotValid.codeNotValid && `Code is not valid.`}
        />
        <TextFieldPassword
          fullWidth
          label="Password:"
          variant="outlined"
          value={password}
          name={"password"}
          onChange={onNamedElementChange(changeAuthTempValueAction)}
          size={"small"}
          classNames={[classes.input]}
          error={isNotValid.passwordsNotEqual || isNotValid.passwordsNotValid}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <TextFieldPassword
          fullWidth
          label="Repeat password:"
          variant="outlined"
          value={repeatPassword}
          name={"repeatPassword"}
          onChange={onNamedElementChange(changeAuthTempValueAction)}
          size={"small"}
          classNames={[classes.input]}
          error={isNotValid.passwordsNotEqual || isNotValid.passwordsNotValid}
          helperText={
            (isNotValid.passwordsNotEqual && `Passwords are not equal.`) ||
            (isNotValid.passwordsNotValid &&
              `Password is not enough strong. Use at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.`)
          }
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <DialogActions>
          <Button onClick={onUpdatePassword}>Update password</Button>
        </DialogActions>
      </>
    );
  }
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle className={classes.dialogTitle}>Forgot password</DialogTitle>
      <DialogContent className={classes.dialogContent}>{content}</DialogContent>
    </Dialog>
  );
};
