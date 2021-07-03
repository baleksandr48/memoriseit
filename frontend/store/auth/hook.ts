import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  AUTH_ACTION,
  AUTH_DIALOG,
  AuthErrors,
  ChangeAuthTempValuePayload
} from "./types";
import { useRouter } from "next/router";
import { Amplify } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
import { recogniseAuthError } from "../../utils";
import { AppState } from "../index";
import { getUserFromCognitoUser } from "../../utils/auth";

const privateRoutes = ["/topics/contributed"];

export function useHandleRedirectForAuth() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (/login-dialog=true/.test(window.location.search)) {
      dispatch({
        type: AUTH_ACTION.REDIRECT_FOR_AUTH
      });
    }
  }, []);
}

export function useOpenAuthDialogAction() {
  const dispatch = useDispatch();
  return useCallback(
    (dialog: AUTH_DIALOG) =>
      dispatch({
        type: AUTH_ACTION.OPEN_AUTH_DIALOG,
        payload: dialog
      }),
    [dispatch]
  );
}

export function useCloseAuthDialog() {
  const dispatch = useDispatch();
  return useCallback(
    () =>
      dispatch({
        type: AUTH_ACTION.CLOSE_AUTH_DIALOG
      }),
    [dispatch]
  );
}

export function useChangeAuthTempValueAction() {
  const dispatch = useDispatch();
  return useCallback(
    (payload: ChangeAuthTempValuePayload) =>
      dispatch({
        type: AUTH_ACTION.CHANGE_AUTH_TEMP_VALUE,
        payload
      }),
    [dispatch]
  );
}

export function useLoginAction() {
  const dispatch = useDispatch();
  const {
    temp: { password, email }
  } = useSelector((store: AppState) => store.authReducer);
  return useCallback(() => {
    (async () => {
      await dispatch({
        type: AUTH_ACTION.LOGIN_START
      });
      try {
        const currentUser: CognitoUser = await Amplify.Auth.signIn(
          email,
          password
        );
        dispatch({
          type: AUTH_ACTION.LOGIN_SUCCESS,
          payload: {
            user: getUserFromCognitoUser(currentUser)
          }
        });
      } catch (e) {
        const error = recogniseAuthError(e);
        if (error === AuthErrors.USER_NOT_CONFIRMED) {
          dispatch({
            type: AUTH_ACTION.OPEN_AUTH_DIALOG,
            payload: AUTH_DIALOG.CONFIRM_ACCOUNT
          });
        } else {
          dispatch({
            type: AUTH_ACTION.LOGIN_ERROR,
            payload: AUTH_DIALOG.CONFIRM_ACCOUNT
          });
        }
      }
    })();
  }, [dispatch, password, email]);
}

export function useSignUpAction() {
  const dispatch = useDispatch();
  const openAuthDialogAction = useOpenAuthDialogAction();
  const {
    temp: { password, email, username }
  } = useSelector((store: AppState) => store.authReducer);

  return useCallback(() => {
    (async () => {
      dispatch({
        type: AUTH_ACTION.SIGNUP_START
      });
      try {
        await Amplify.Auth.signUp({
          username: email,
          password: password,
          attributes: {
            email: email,
            nickname: username,
            "custom:role": "user"
          }
        });
        openAuthDialogAction(AUTH_DIALOG.CONFIRM_ACCOUNT);
      } catch (e) {
        dispatch({
          type: AUTH_ACTION.SIGNUP_ERROR,
          payload: {
            error: recogniseAuthError(e)
          }
        });
      }
    })();
  }, [dispatch, password, email, username]);
}

export function useConfirmAccountAction() {
  const dispatch = useDispatch();
  const loginAction = useLoginAction();
  const {
    temp: { email, confirmationCode }
  } = useSelector((store: AppState) => store.authReducer);

  return useCallback(() => {
    (async () => {
      console.log({ email, confirmationCode });
      dispatch({
        type: AUTH_ACTION.CONFIRM_ACCOUNT_START
      });
      try {
        console.log({ email, confirmationCode });
        await Amplify.Auth.confirmSignUp(email, confirmationCode);
        console.log({ email, confirmationCode });
        dispatch({
          type: AUTH_ACTION.CONFIRM_ACCOUNT_SUCCESS
        });
        loginAction();
      } catch (e) {
        dispatch({
          type: AUTH_ACTION.CONFIRM_ACCOUNT_ERROR,
          payload: {
            error: recogniseAuthError(e)
          }
        });
      }
    })();
  }, [dispatch, email, confirmationCode]);
}

export function useResendConfirmAccountAction() {
  const dispatch = useDispatch();
  const {
    temp: { email }
  } = useSelector((store: AppState) => store.authReducer);

  return useCallback(() => {
    (async () => {
      dispatch({
        type: AUTH_ACTION.RESEND_CONFIRM_ACCOUNT_START
      });
      try {
        await Amplify.Auth.resendSignUp(email);
        dispatch({
          type: AUTH_ACTION.RESEND_CONFIRM_ACCOUNT_SUCCESS
        });
      } catch (e) {
        dispatch({
          type: AUTH_ACTION.RESEND_CONFIRM_ACCOUNT_ERROR,
          payload: {
            error: recogniseAuthError(e)
          }
        });
      }
    })();
  }, [dispatch, email]);
}

export function useSendEmailForgotPasswordAction() {
  const dispatch = useDispatch();
  const {
    temp: { email }
  } = useSelector((store: AppState) => store.authReducer);
  return useCallback(() => {
    (async () => {
      dispatch({ type: AUTH_ACTION.SEND_EMAIL_FORGOT_PASSWORD_START });
      try {
        await Amplify.Auth.forgotPassword(email);
        dispatch({ type: AUTH_ACTION.SEND_EMAIL_FORGOT_PASSWORD_SUCCESS });
      } catch (e) {
        dispatch({
          type: AUTH_ACTION.SEND_EMAIL_FORGOT_PASSWORD_ERROR,
          payload: {
            error: recogniseAuthError(e)
          }
        });
      }
    })();
  }, [dispatch, email]);
}

export function useUpdatePasswordAction() {
  const dispatch = useDispatch();
  const {
    temp: { email, confirmationCode, password }
  } = useSelector((store: AppState) => store.authReducer);

  return useCallback(() => {
    (async () => {
      dispatch({
        type: AUTH_ACTION.UPDATE_PASSWORD_START
      });
      try {
        await Amplify.Auth.forgotPasswordSubmit(
          email,
          confirmationCode,
          password
        );
        dispatch({
          type: AUTH_ACTION.UPDATE_PASSWORD_SUCCESS
        });
      } catch (e) {
        dispatch({
          type: AUTH_ACTION.UPDATE_PASSWORD_ERROR,
          payload: {
            error: recogniseAuthError(e)
          }
        });
      }
    })();
  }, [dispatch, email, confirmationCode, password]);
}

export function useLogoutAction() {
  const dispatch = useDispatch();
  const router = useRouter();

  return useCallback(() => {
    (async () => {
      dispatch({
        type: AUTH_ACTION.LOGOUT_START
      });
      try {
        await Amplify.Auth.signOut();
        dispatch({
          type: AUTH_ACTION.LOGOUT_SUCCESS
        });
      } catch (e) {
        dispatch({
          type: AUTH_ACTION.LOGOUT_ERROR,
          payload: {
            error: AuthErrors.OTHER
          }
        });
      }
      if (
        privateRoutes.some(
          privateRoute => privateRoute === window.location.pathname
        )
      ) {
        await router.push("/");
      }
    })();
  }, [dispatch]);
}
