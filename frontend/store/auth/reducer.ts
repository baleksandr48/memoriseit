import {
  AUTH_ACTION,
  AUTH_DIALOG,
  AuthState,
  ChangeAuthTempValuePayload,
  LoginErrorPayload,
  LoginSuccessPayload
} from "./types";
import moment from "moment";
import { TestErrorPayload } from "../test/types";
import { toast } from "react-toastify";

const defaultTempPasswordsAndCode = {
  password: process.env.NEXT_PUBLIC_AUTH_DIALOG_DEFAULT_PASSWORD || "",
  repeatPassword: process.env.NEXT_PUBLIC_AUTH_DIALOG_DEFAULT_PASSWORD || "",
  confirmationCode: ""
};

const defaultTemp = {
  email: process.env.NEXT_PUBLIC_AUTH_DIALOG_DEFAULT_EMAIL || "",
  resetPassCodeSentTo: "",
  username: process.env.NEXT_PUBLIC_AUTH_DIALOG_DEFAULT_USERNAME || "",
  ...defaultTempPasswordsAndCode
};

export const authInitState: AuthState = {
  currentUser: null,
  openedDialog: null,
  error: null,
  loading: false,
  temp: {
    ...defaultTemp
  },
  resetPassIsDone: false
};

export const authReducer = (state = authInitState, action: any): AuthState => {
  switch (action.type) {
    case AUTH_ACTION.REDIRECT_FOR_AUTH: {
      return {
        ...state,
        openedDialog: AUTH_DIALOG.LOGIN
      };
    }
    case AUTH_ACTION.OPEN_AUTH_DIALOG: {
      return {
        ...state,
        openedDialog: action.payload,
        loading: false,
        error: null,
        temp: {
          ...state.temp,
          ...defaultTempPasswordsAndCode
        }
      };
    }
    case AUTH_ACTION.CLOSE_AUTH_DIALOG: {
      return {
        ...state,
        openedDialog: null,
        error: null,
        temp: {
          ...defaultTemp
        },
        resetPassIsDone: false
      };
    }
    case AUTH_ACTION.LOGOUT_START:
    case AUTH_ACTION.SEND_EMAIL_FORGOT_PASSWORD_START:
    case AUTH_ACTION.UPDATE_PASSWORD_START:
    case AUTH_ACTION.CONFIRM_ACCOUNT_START:
    case AUTH_ACTION.SIGNUP_START:
    case AUTH_ACTION.LOGIN_START: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
    case AUTH_ACTION.RESEND_CONFIRM_ACCOUNT_START: {
      return {
        ...state,
        loading: true,
        error: null,
        lastTimeResendConfirmation: moment().unix()
      };
    }
    case AUTH_ACTION.RESEND_CONFIRM_ACCOUNT_SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }
    case AUTH_ACTION.LOGIN_SUCCESS: {
      return {
        ...state,
        currentUser: (action.payload as LoginSuccessPayload).user,
        error: null,
        loading: false,
        temp: {
          ...defaultTemp
        }
      };
    }
    case AUTH_ACTION.UPDATE_PASSWORD_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        resetPassIsDone: true
      };
    }
    case AUTH_ACTION.SEND_EMAIL_FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        temp: {
          ...state.temp,
          ...defaultTempPasswordsAndCode,
          resetPassCodeSentTo: state.temp.email
        }
      };
    }
    case AUTH_ACTION.LOGOUT_SUCCESS: {
      return {
        ...state,
        currentUser: null,
        error: null,
        loading: false,
        openedDialog: null,
        temp: {
          ...defaultTemp
        }
      };
    }
    case AUTH_ACTION.LOGOUT_ERROR:
    case AUTH_ACTION.SEND_EMAIL_FORGOT_PASSWORD_ERROR:
    case AUTH_ACTION.UPDATE_PASSWORD_ERROR:
    case AUTH_ACTION.RESEND_CONFIRM_ACCOUNT_ERROR:
    case AUTH_ACTION.CONFIRM_ACCOUNT_ERROR:
    case AUTH_ACTION.SIGNUP_ERROR:
    case AUTH_ACTION.LOGIN_ERROR: {
      const error = (action.payload as LoginErrorPayload).error;
      toast.error(error);
      return {
        ...state,
        loading: false,
        temp: {
          ...state.temp,
          ...defaultTempPasswordsAndCode
        },
        error
      };
    }
    case AUTH_ACTION.CHANGE_AUTH_TEMP_VALUE: {
      const payload = action.payload as ChangeAuthTempValuePayload;
      const temp = { ...state.temp, ...payload };
      return {
        ...state,
        temp
      };
    }
    default:
      return state;
  }
};
