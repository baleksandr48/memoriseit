import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../../models/article.model';
import { Connection, Repository } from 'typeorm/index';
import { ArticleCreate, ArticleUpdate } from './types-and-schemas';
import { TopicService } from '../topic/topic.service';
import { TestService } from '../test/test.service';
import { TABLE_NAME } from '../../constants';
import { TopicApi } from '../topic/types-and-schemas';
import { Test } from '../../models/test.model';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private connection: Connection,
    @Inject(forwardRef(() => TopicService))
    private topicService: TopicService,
    private testService: TestService,
  ) {}

  async getNextChildArticleOrder(topicId: number, parentId?: number) {
    const lastArticle = await this.articleRepository.findOne({
      where: {
        parentId: parentId || null,
        topicId,
      },
      order: {
        order: 'DESC',
      },
    });
    if (lastArticle) {
      return lastArticle.order + 1;
    }
    return 1;
  }

  async getArticlePage(
    articleId: number,
  ): Promise<{ article: Article; topic: TopicApi; tests: Test[] }> {
    const article = await this.articleRepository.findOne(articleId, {
      relations: ['topic', 'tests', 'topic.contributors'],
    });
    if (!article) {
      throw new Error(`Article is not found`);
    }
    if (article.isGroup) {
      throw new Error(`Can't display page for article group.`);
    }
    const tableOfContents = await this.topicService.getTableOfContents(
      article.topic!.id,
      article.topic!.name,
    );
    const topic = { ...article.topic!, tableOfContents };
    const tests = article.tests!.map(test =>
      this.testService.removeCorrectAnswersFromTest(test),
    );
    return {
      article,
      topic,
      tests,
    };
  }

  async create(articleCreate: ArticleCreate): Promise<Article> {
    const order = await this.getNextChildArticleOrder(
      articleCreate.topicId,
      articleCreate.parentId,
    );
    return this.articleRepository.save({
      ...articleCreate,
      order,
    });
  }

  async update(articleId: number, articleUpdate: ArticleUpdate): Promise<void> {
    await this.articleRepository.update(articleId, articleUpdate);
  }

  async delete(articleId: number): Promise<void> {
    await this.articleRepository.delete(articleId);
  }

  async getAllChildArticles(
    topicId: number,
    articleId?: number,
  ): Promise<Article[]> {
    const parameters = [topicId];
    if (articleId) {
      parameters.push(articleId);
    }
    return this.connection.query(
      `WITH RECURSIVE tree AS (
          SELECT *
          FROM ${TABLE_NAME.ARTICLE} article
          WHERE article."topicId" = $1
            AND article."parentId" ${articleId ? '= $2' : 'IS NULL'}
        UNION
          SELECT article.*
          FROM ${TABLE_NAME.ARTICLE} article
          INNER JOIN tree ON tree."id" = article."parentId"
      )
      SELECT *
      FROM tree`,
      parameters,
    );
  }
}
