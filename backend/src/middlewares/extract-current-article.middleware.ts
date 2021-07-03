import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as _ from 'lodash';
import joi from 'joi';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from '../utils/validate';
import { Article } from '../models/article.model';

@Injectable()
export class ExtractCurrentArticleMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const articleId = validate(joi.number().required(), req.params.articleId);
    const article = await this.articleRepository.findOne({
      where: {
        id: articleId,
      },
    });
    if (!article) {
      throw new NotFoundException(`Article ${articleId} not found.`);
    }
    _.set(req, 'payload.article', article);
    next();
  }
}
