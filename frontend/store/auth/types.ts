export interface User {
  nickname: string;
  role: string;
  email: string;
}

export enum UserRole {
  user = "user",
  admin = "admin"
}

export interface LoginSuccessPayload {
  user: User;
}
export interface LoginErrorPayload {
  error: AuthErrors;
}
export type ChangeAuthTempValuePayload = Partial<AuthTempValues>;

//---OTHER---
export interface AuthState {
  loading: boolean;
  currentUser: {
    email: string;
    nickname: string;
    role: string;
  } | null;
  error: AuthErrors | null;
  temp: AuthTempValues;
  lastTimeResendConfirmation?: number;
  resetPassIsDone?: boolean;
  openedDialog: AUTH_DIALOG | null;
}

export interface AuthTempValues {
  email: string;
  password: string;
  repeatPassword: string;
  resetPassCodeSentTo: string;
  username: string;
  confirmationCode: string;
}

export enum AuthErrors {
  USER_ALREADY_EXIST,
  USER_NOT_CONFIRMED,
  USER_NOT_EXIST,
  CONFIRMATION_CODE_IS_WRONG,
  OTHER,
  LIMIT_EXCEED,
  USER_ALREADY_CONFIRMED,
  CODE_MISMATCH_EXCEPTION
}

export enum AUTH_DIALOG {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SIGNUP = "SIGNUP",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  CONFIRM_ACCOUNT = "CONFIRM_ACCOUNT"
}

export enum AUTH_ACTION {
  OPEN_AUTH_DIALOG = "OPEN_AUTH_DIALOG",
  CLOSE_AUTH_DIALOG = "CLOSE_AUTH_DIALOG",
  CHANGE_AUTH_TEMP_VALUE = "CHANGE_AUTH_TEMP_VALUE",
  REDIRECT_FOR_AUTH = "REDIRECT_FOR_AUTH",

  LOGIN_START = "LOGIN_START",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_ERROR = "LOGIN_ERROR",

  LOGOUT_START = "LOGOUT_START",
  LOGOUT_SUCCESS = "LOGOUT_SUCCESS",
  LOGOUT_ERROR = "LOGOUT_ERROR",

  SIGNUP_START = "SIGNUP_START",
  SIGNUP_SUCCESS = "SIGNUP_SUCCESS",
  SIGNUP_ERROR = "SIGNUP_ERROR",

  CONFIRM_ACCOUNT_START = "CONFIRM_ACCOUNT_START",
  CONFIRM_ACCOUNT_SUCCESS = "CONFIRM_ACCOUNT_SUCCESS",
  CONFIRM_ACCOUNT_ERROR = "CONFIRM_ACCOUNT_ERROR",

  RESEND_CONFIRM_ACCOUNT_START = "RESEND_CONFIRM_ACCOUNT_START",
  RESEND_CONFIRM_ACCOUNT_SUCCESS = "RESEND_CONFIRM_ACCOUNT_SUCCESS",
  RESEND_CONFIRM_ACCOUNT_ERROR = "RESEND_CONFIRM_ACCOUNT_ERROR",

  UPDATE_PASSWORD_START = "UPDATE_PASSWORD_START",
  UPDATE_PASSWORD_SUCCESS = "UPDATE_PASSWORD_SUCCESS",
  UPDATE_PASSWORD_ERROR = "UPDATE_PASSWORD_ERROR",

  SEND_EMAIL_FORGOT_PASSWORD_START = "SEND_EMAIL_FORGOT_PASSWORD_START",
  SEND_EMAIL_FORGOT_PASSWORD_SUCCESS = "SEND_EMAIL_FORGOT_PASSWORD_SUCCESS",
  SEND_EMAIL_FORGOT_PASSWORD_ERROR = "SEND_EMAIL_FORGOT_PASSWORD_ERROR"
}
