import joi from 'joi';

export interface ArticleCreate {
  text?: string;
  title: string;
  topicId: number;
  parentId?: number;
  isGroup?: boolean;
}

export type ArticleUpdate = Partial<Pick<ArticleCreate, 'text' | 'title'>>;

export const articleCreateSchema = joi.object({
  text: joi.string(),
  title: joi.string().required(),
  parentId: joi.number(),
  topicId: joi.number().required(),
  isGroup: joi.boolean().default(false),
});

export const articleUpdateSchema = joi.object({
  text: joi.string(),
  title: joi.string(),
});
