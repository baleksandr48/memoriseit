import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as _ from 'lodash';
import joi from 'joi';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from '../utils/validate';
import { Topic } from '../models/topic.model';

@Injectable()
export class ExtractCurrentTopicMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const topicId = validate<number>(
      joi.number().required(),
      req.params.topicId,
    );
    const topic = await this.topicRepository.findOne({
      where: {
        id: topicId,
      },
      relations: ['contributors'],
    });
    if (!topic) {
      throw new NotFoundException(`Topic ${topicId} is not found.`);
    }
    _.set(req, 'payload.topic', topic);
    next();
  }
}
