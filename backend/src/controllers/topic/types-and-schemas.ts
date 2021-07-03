import joi from 'joi';
import { Topic } from '../../models/topic.model';
import { Tree } from '../../utils/tree-utils';

export interface TableOfContentsOwnFields {
  id: number;
  title: string;
}

export type TableOfContents = Tree<TableOfContentsOwnFields>;

export interface TopicCreate {
  name: string;
  description?: string;
}

export interface TopicApi extends Topic {
  tableOfContents: TableOfContents;
}

export type ArticleTree = Tree<{
  id: number;
  title: string;
  isGroup: boolean;
  order: number;
}>;

export type TopicUpdate = Partial<TopicCreate>;

export const topicCreateSchema = joi.object({
  name: joi.string().required(),
  description: joi.string(),
});

export const topicUpdateSchema = joi.object({
  name: joi.string(),
  description: joi.string(),
});
