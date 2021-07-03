import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import joi from 'joi';
import { validate } from '../utils/validate';
import { Repository } from 'typeorm/index';
import { User } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExtractUserFromTokenMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    let idToken = _.get(req.headers, 'authorization', null);
    if (!idToken) {
      console.log(`Token is not provided.`);
      return next();
    }
    try {
      idToken = idToken.split(' ')[1];
      const decodedToken = jwt.decode(idToken);
      const userEmail = validate<string>(
        joi
          .string()
          .email()
          .required(),
        _.get(decodedToken, 'email'),
      );
      let user = await this.userRepository.findOne({
        where: {
          email: userEmail,
        },
        relations: ['contributes'],
      });
      if (!user) {
        const name = validate<string>(
          joi.string().required(),
          _.get(decodedToken, 'nickname'),
        );
        console.log(`User ${userEmail} doesn't exist. Create it`);
        user = await this.userRepository.save({
          email: userEmail,
          name,
        });
        user.contributes = [];
      }
      _.set(req, 'payload.currentUser', user);
      console.log(`Token is provided. User email: ${userEmail}`);
    } catch (error) {
      console.error(error.message);
    }
    next();
  }
}
