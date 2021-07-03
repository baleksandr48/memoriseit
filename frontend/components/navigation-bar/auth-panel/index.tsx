import React, { FunctionComponent } from "react";
import { Button } from "@material-ui/core";
import { AUTH_DIALOG } from "../../../store/auth/types";
import { SignUpDialog } from "./signup-dialog";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import { LogInDialog } from "./login-dialog";
import { ConfirmAccountDialog } from "./confirm-email-dialog";
import { ForgotPasswordDialog } from "./forgot-password-dialog";
import {
  useCloseAuthDialog,
  useOpenAuthDialogAction,
} from "../../../store/auth/hook";

export const AuthPanel: FunctionComponent = () => {
  const openAuthDialogAction = useOpenAuthDialogAction();
  const closeAuthDialog = useCloseAuthDialog();

  const { openedDialog } = useSelector((store: AppState) => store.authReducer);

  return (
    <>
      <Button onClick={() => openAuthDialogAction(AUTH_DIALOG.LOGIN)}>
        Log in
      </Button>
      <Button onClick={() => openAuthDialogAction(AUTH_DIALOG.SIGNUP)}>
        Sign up
      </Button>
      {openedDialog === AUTH_DIALOG.SIGNUP && (
        <SignUpDialog onClose={closeAuthDialog} />
      )}
      {openedDialog === AUTH_DIALOG.LOGIN && (
        <LogInDialog onClose={closeAuthDialog} />
      )}
      {openedDialog === AUTH_DIALOG.CONFIRM_ACCOUNT && (
        <ConfirmAccountDialog onClose={closeAuthDialog} />
      )}
      {openedDialog === AUTH_DIALOG.FORGOT_PASSWORD && (
        <ForgotPasswordDialog onClose={closeAuthDialog} />
      )}
    </>
  );
};
