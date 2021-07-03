import BaseApi from "./base-api";
import { TopicCreate } from "../../backend/src/controllers/topic/types-and-schemas";
import {
  Contributor,
  TableOfContents,
  TableOfContentsApiOwnFields,
  TableOfContentsOwnFields,
  Topic,
  TopicApi as TopicApiType
} from "../store/topic/types";
import { mapTree } from "../utils/tree-utils";

export class TopicApi extends BaseApi {
  static getContributedTopicsPage() {
    return this.get<Topic[]>("/page/topics/contributed");
  }

  static async getTopicPage(topicId: string | number): Promise<Topic> {
    const topicApi = await this.get<TopicApiType>(`/page/topic/${topicId}`);

    const tableOfContents = mapTree<
      TableOfContentsApiOwnFields,
      TableOfContentsOwnFields
    >(topicApi.tableOfContents, tree => {
      return {
        ...tree,
        isSelected: false,
        isExpanded: true
      };
    }) as TableOfContents;

    return {
      ...topicApi,
      tableOfContents
    };
  }

  static deleteTopic(topicId: string | number) {
    return this.delete(`/topic/${topicId}`);
  }

  static createTopic(topicCreate: TopicCreate) {
    return this.post<Topic>("/topics", topicCreate);
  }

  static addContributor(topicId: string | number, email: string) {
    return this.post<Contributor>(`/topic/${topicId}/contributors`, {
      email
    });
  }

  static removeContributor(topicId: string | number, contributorId: number) {
    return this.delete(`/topic/${topicId}/contributor/${contributorId}`);
  }

  static getTopicsForExams() {
    return this.get("/page/exams");
  }
}
