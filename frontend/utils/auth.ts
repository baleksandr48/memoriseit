import { withSSRContext } from "aws-amplify";
import * as _ from "lodash";
import { AmplifyClass } from "@aws-amplify/core";
import { CognitoUser } from "amazon-cognito-identity-js";
import { User } from "../store/auth/types";

export const getAmplifyInstance = (context: any) => {
  return withSSRContext(context);
};

export const getCurrentUser = async (amplifyInstance: AmplifyClass) => {
  try {
    const cognitoUser = await amplifyInstance.Auth.currentAuthenticatedUser();
    return getUserFromCognitoUser(cognitoUser);
  } catch (err) {
    return null;
  }
};

export const getUserFromCognitoUser = (cognitoUser: CognitoUser): User => {
  return {
    nickname: _.get(cognitoUser, "attributes.nickname"),
    role: _.get(cognitoUser, "attributes.custom:role"),
    email: _.get(cognitoUser, "attributes.email")
  };
};
