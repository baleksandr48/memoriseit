import React, { FunctionComponent, useState } from "react";
import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import { AuthErrors } from "../../../store/auth/types";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  onNamedElementChange,
} from "../../../utils";
import { TextFieldPassword } from "../../common/text-field-password";
import Loader from "../../common/loader";
import {
  useChangeAuthTempValueAction,
  useSignUpAction,
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
  usernameNotValid,
  passwordsNotEqual,
  passwordsNotValid,
}

interface Props {
  onClose();
}

export const SignUpDialog: FunctionComponent<Props> = ({ onClose }) => {
  const [validationError, setValidationError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const signUpAction = useSignUpAction();
  const changeAuthTempValueAction = useChangeAuthTempValueAction();

  const {
    error,
    loading,
    temp: { password, email, repeatPassword, username },
  } = useSelector((store: AppState) => store.authReducer);
  const classes = useStyles();

  const isNotValid = {
    email: validationError === ValidationErrors.emailIsNotValid,
    username: validationError === ValidationErrors.usernameNotValid,
    passwordsNotEqual: validationError === ValidationErrors.passwordsNotEqual,
    passwordsNotValid: validationError === ValidationErrors.passwordsNotValid,
  };

  const errorMessage =
    (error === AuthErrors.OTHER && `Something went wrong`) ||
    (error === AuthErrors.USER_ALREADY_EXIST &&
      `Account with this email is already registered.`) ||
    (error === AuthErrors.LIMIT_EXCEED &&
      `You have reached the message limit, try again later`);

  const resetPasswords = () => {
    changeAuthTempValueAction({
      password: "",
      repeatPassword: "",
    });
  };

  const onSubmit = () => {
    if (!isValidEmail(email)) {
      setValidationError(ValidationErrors.emailIsNotValid);
      return resetPasswords();
    } else if (!isValidUsername(username)) {
      setValidationError(ValidationErrors.usernameNotValid);
      return resetPasswords();
    } else if (password !== repeatPassword) {
      setValidationError(ValidationErrors.passwordsNotEqual);
      return resetPasswords();
    } else if (!isValidPassword(password)) {
      setValidationError(ValidationErrors.passwordsNotValid);
      return resetPasswords();
    } else {
      setValidationError(null);
    }
    signUpAction();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle className={classes.dialogTitle}>Sign up</DialogTitle>
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
              name={"email"}
              onChange={onNamedElementChange(changeAuthTempValueAction)}
              size={"small"}
              className={classes.input}
              error={isNotValid.email}
              helperText={isNotValid.email && `Email is not valid.`}
            />
            <TextField
              fullWidth
              label="Nickname:"
              type="text"
              variant="outlined"
              value={username}
              name={"username"}
              onChange={onNamedElementChange(changeAuthTempValueAction)}
              size={"small"}
              className={classes.input}
              error={isNotValid.username}
              helperText={isNotValid.username && `Nickname is not valid.`}
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
              error={
                isNotValid.passwordsNotEqual || isNotValid.passwordsNotValid
              }
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
              error={
                isNotValid.passwordsNotEqual || isNotValid.passwordsNotValid
              }
              helperText={
                (isNotValid.passwordsNotEqual && `Passwords are not equal.`) ||
                (isNotValid.passwordsNotValid &&
                  `Password is not enough strong. Use at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.`)
              }
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            <DialogActions>
              <Button onClick={onSubmit}>Sign up</Button>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
