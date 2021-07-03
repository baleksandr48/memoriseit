import { AxiosResponse } from "axios";

export const executeRequest = async <ResultType>(
  response: Promise<AxiosResponse>
) => {
  try {
    const { data } = await response;
    return data as ResultType;
  } catch (e) {
    throw new Error(e.message);
  }
};
