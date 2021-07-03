import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { validate } from '../../utils/validate';
import {
  ArticleCreate,
  articleCreateSchema,
  ArticleUpdate,
  articleUpdateSchema,
} from './types-and-schemas';
import { Article } from '../../models/article.model';
import { TopicApi } from '../topic/types-and-schemas';
import { Test } from '../../models/test.model';
import { IsTopicContributorGuard } from '../../guard/is-topic-contributor';

@Controller()
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get('page/topic/:topicId/article/:articleId')
  async getArticlePage(
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<{ article: Article; topic: TopicApi; tests: Test[] }> {
    return this.articleService.getArticlePage(articleId);
  }

  @UseGuards(IsTopicContributorGuard)
  @Post('topic/:topicId/articles')
  async save(@Body() body: ArticleCreate | unknown): Promise<Article> {
    const articleCreate = validate<ArticleCreate>(articleCreateSchema, body);
    return this.articleService.create(articleCreate);
  }

  @UseGuards(IsTopicContributorGuard)
  @Put('topic/:topicId/article/:articleId')
  async update(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() body: ArticleUpdate | unknown,
  ): Promise<void> {
    const articleUpdate: ArticleUpdate = validate(articleUpdateSchema, body);
    return this.articleService.update(articleId, articleUpdate);
  }

  @UseGuards(IsTopicContributorGuard)
  @Delete('topic/:topicId/article/:articleId')
  async delete(
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<void> {
    return this.articleService.delete(articleId);
  }
}
