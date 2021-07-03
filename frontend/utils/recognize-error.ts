import { AuthErrors } from "../store/auth/types";

export const recogniseAuthError = (error: {
  code: string;
  name: string;
  message: string;
}): AuthErrors => {
  // when try to confirm already confirmed user you also have an error code 'NotAuthorizedException'
  if (
    error.message === "User cannot be confirmed. Current status is CONFIRMED"
  ) {
    return AuthErrors.USER_ALREADY_CONFIRMED;
  } else if (
    error.code === "UserNotFoundException" ||
    error.code === "NotAuthorizedException"
  ) {
    return AuthErrors.USER_NOT_EXIST;
  } else if (error.code === "UserNotConfirmedException") {
    return AuthErrors.USER_NOT_CONFIRMED;
  } else if (error.code === "LimitExceededException") {
    return AuthErrors.LIMIT_EXCEED;
  } else if (error.code === "UsernameExistsException") {
    return AuthErrors.USER_ALREADY_EXIST;
  }  else if (error.code === "CodeMismatchException") {
    return AuthErrors.CODE_MISMATCH_EXCEPTION;
  } else {
    return AuthErrors.OTHER;
  }
};
