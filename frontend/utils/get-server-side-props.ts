import { getAmplifyInstance, getCurrentUser } from "./auth";
import { AmplifyClass } from "@aws-amplify/core";
import { User } from "../store/auth/types";

export const getPrivatePageProps = <Props, Params = {}>(
  callback: (
    params: Params,
    amplifyInstance: AmplifyClass,
    currentUser: User
  ) => Promise<{ props: Props }>
) => async (context: any) => {
  const amplifyInstance = await getAmplifyInstance(context);
  const currentUser = await getCurrentUser(amplifyInstance);
  if (!currentUser) {
    context.res.setHeader("Location", "/?login-dialog=true");
    context.res.statusCode = 302;
    context.res.end();
    return;
  }
  return callback(context.params, amplifyInstance, currentUser);
};

export const getPublicPageProps = <Props, Params = {}>(
  callback: (
    params: Params,
    amplifyInstance: AmplifyClass,
    currentUser: User | null
  ) => Promise<{ props: Props }>
) => async (context: any) => {
  const amplifyInstance = await getAmplifyInstance(context);
  const currentUser = await getCurrentUser(amplifyInstance);
  return callback(context.params, amplifyInstance, currentUser);
};
