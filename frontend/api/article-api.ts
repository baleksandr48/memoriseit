import { Article } from "../store/article/types";
import {
  TableOfContents,
  TableOfContentsApiOwnFields,
  TableOfContentsOwnFields,
  Topic,
  TopicApi
} from "../store/topic/types";
import { Test } from "../store/test/types";
import BaseApi from "./base-api";
import { mapTree } from "../utils/tree-utils";

export class ArticleApi extends BaseApi {
  static updateArticle(
    topicId: string | number,
    articleId: string | number,
    articleUpdate: {
      title: string;
      text: string;
    }
  ) {
    return this.put(`/topic/${topicId}/article/${articleId}`, articleUpdate);
  }

  static removeArticle(topicId: string | number, articleId: string | number) {
    return this.delete(`/topic/${topicId}/article/${articleId}`);
  }

  static createArticle(
    topicId: string | number,
    articleCreate: {
      title: string;
      isGroup: boolean;
      parentId?: number;
      topicId: number;
    }
  ) {
    return this.post(`/topic/${topicId}/articles`, articleCreate);
  }

  static async getArticlePage(
    topicId: string | number,
    articleId: string | number
  ): Promise<{ article: Article; topic: Topic; tests: Test[] }> {
    const { article, topic, tests } = await this.get<{
      article: Article;
      topic: TopicApi;
      tests: Test[];
    }>(`/page/topic/${topicId}/article/${articleId}`);

    const tableOfContents = mapTree<
      TableOfContentsApiOwnFields,
      TableOfContentsOwnFields
    >(topic.tableOfContents, tree => {
      return {
        ...tree,
        isSelected: tree.id == articleId,
        isExpanded: true
      };
    }) as TableOfContents;

    return {
      article,
      topic: {
        ...topic,
        tableOfContents
      },
      tests
    };
  }
}
