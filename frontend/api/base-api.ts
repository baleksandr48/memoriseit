import axios, { AxiosResponse } from "axios";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Amplify } from "aws-amplify";
import { BASE_URL } from "../utils";
import { AmplifyClass } from "@aws-amplify/core";

let amplifyInstance = Amplify;

export default class BaseApi {
  static setAmplifyInstance(instance: AmplifyClass) {
    amplifyInstance = instance;
  }

  static async query<ResultType>(response: Promise<AxiosResponse>) {
    try {
      const { data } = await response;
      return data as ResultType;
    } catch (err) {
      throw err;
    }
  }

  static async getToken() {
    try {
      const currentUser: CognitoUser = await amplifyInstance.Auth.currentAuthenticatedUser();
      const amplifyToken = currentUser
        ?.getSignInUserSession()
        ?.getIdToken()
        .getJwtToken();
      return `Bearer ${amplifyToken}`;
    } catch (err) {
      return null;
    }
  }

  static async getHeaders() {
    const token = await this.getToken();
    return {
      headers: {
        Authorization: token
      }
    };
  }

  static async get<ResultType>(endpoint: string) {
    const headers = await this.getHeaders();
    return this.query<ResultType>(axios.get(`${BASE_URL}${endpoint}`, headers));
  }

  static async post<ResultType>(endpoint: string, body: any) {
    const headers = await this.getHeaders();
    return this.query<ResultType>(
      axios.post(`${BASE_URL}${endpoint}`, body, headers)
    );
  }

  static async put<ResultType>(endpoint: string, body: any) {
    const headers = await this.getHeaders();
    return this.query<ResultType>(
      axios.put(`${BASE_URL}${endpoint}`, body, headers)
    );
  }

  static async delete<ResultType>(endpoint: string) {
    const headers = await this.getHeaders();
    return this.query<ResultType>(
      axios.delete(`${BASE_URL}${endpoint}`, headers)
    );
  }
}
