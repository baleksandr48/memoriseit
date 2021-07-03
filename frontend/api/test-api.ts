import { Test } from "../store/test/types";
import BaseApi from "./base-api";

export class TestApi extends BaseApi {
  static getArticleTests(topicId: string | number, articleId: string | number) {
    return this.get<Test[]>(
      `/page/topic/${topicId}/article/${articleId}/tests`
    );
  }
  static saveArticleTests(
    topicId: number | string,
    articleId: number | string,
    tests: Test[]
  ) {
    return this.put(`/topic/${topicId}/article/${articleId}/tests`, tests);
  }
  static checkAnswersForTests(
    topicId: number | string,
    articleId: number | string,
    tests: Test[]
  ) {
    return this.post(
      `/topic/${topicId}/article/${articleId}/tests/check`,
      tests
    );
  }
}
