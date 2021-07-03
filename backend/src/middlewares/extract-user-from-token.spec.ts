import { ExtractUserFromTokenMiddleware } from './extract-user-from-token.middleware';
import * as jwt from 'jsonwebtoken';
import { TestingModule } from '@nestjs/testing';
import { Test as NestJsTest } from '@nestjs/testing/test';
import { EmailModule } from '../email/email.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config';
import { Topic } from '../models/topic.model';
import { User } from '../models/user.model';
import { Contributor } from '../models/contributor.model';
import { forwardRef } from '@nestjs/common';
import { ContributorModule } from '../controllers/contributor/contributor.module';
import { ContributorService } from '../controllers/contributor/contributor.service';
import { Repository } from 'typeorm/index';

describe('ExtractUserFromTokenMiddleware', () => {
  let extractUserFromTokenMiddleware: ExtractUserFromTokenMiddleware;
  let userRepository: Repository<User>;
  let user: User;

  beforeAll(async () => {
    const testModule: TestingModule = await NestJsTest.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config.db),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [ExtractUserFromTokenMiddleware],
    }).compile();
    extractUserFromTokenMiddleware = testModule.get<
      ExtractUserFromTokenMiddleware
    >(ExtractUserFromTokenMiddleware);
    userRepository = testModule.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeAll(async () => {
    await userRepository.delete({});
    user = await userRepository.save({
      name: 'name',
      email: 'random@email.com',
      contributes: [],
    });
  });

  it(`should put user to req object`, async () => {
    const token = jwt.sign({ email: user.email }, 'secret');
    const req: any = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const res: any = null;
    const next = () => {};
    await extractUserFromTokenMiddleware.use(req, res, next);
    expect(req.payload.currentUser).toEqual(user);
  });

  it(`should put userEmail to req object`, async () => {
    const req: any = {
      headers: {},
    };
    const res: any = null;
    const next = () => {};
    await extractUserFromTokenMiddleware.use(req, res, next);
    expect(req?.payload?.userEmail).toBeFalsy();
  });
});
