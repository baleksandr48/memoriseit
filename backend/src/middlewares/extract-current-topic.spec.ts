import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm/index';
import { ExtractCurrentTopicMiddleware } from './extract-current-topic.middleware';
import { Contributor } from '../models/contributor.model';
import { config } from '../config';
import { CONTRIBUTOR_TYPE } from '../constants';
import { Topic } from '../models/topic.model';
import { User } from '../models/user.model';

describe('ExtractCurrentTopicMiddleware', () => {
  let extractCurrentTopicMiddleware: ExtractCurrentTopicMiddleware;
  let connection: Connection;
  let topicRepository: Repository<Topic>;
  let userRepository: Repository<User>;

  let createdTopic: Topic;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config.db),
        TypeOrmModule.forFeature([Topic, Contributor, User]),
      ],
      providers: [ExtractCurrentTopicMiddleware],
    }).compile();
    extractCurrentTopicMiddleware = testModule.get<
      ExtractCurrentTopicMiddleware
    >(ExtractCurrentTopicMiddleware);
    topicRepository = testModule.get<Repository<Topic>>(
      getRepositoryToken(Topic),
    );
    userRepository = testModule.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await topicRepository.delete({});
    await userRepository.delete({});
    const createdUser = await userRepository.save({
      name: 'name',
      email: 'email',
    });
    createdTopic = await topicRepository.save({
      name: 'name',
      description: 'description',
      contributors: [
        {
          user: createdUser,
          type: CONTRIBUTOR_TYPE.CREATOR,
        },
      ],
    });
  });

  afterAll(async () => {
    await connection.close();
  });

  it(`should put topic with contributors to req object`, async () => {
    const req: any = {
      params: {
        topicId: createdTopic.id,
      },
    };
    const res: any = null;
    const next = () => {};
    await extractCurrentTopicMiddleware.use(req, res, next);
    expect(req.payload.topic).toBeTruthy();
    expect(req.payload.topic.contributors.length).toEqual(1);
  });

  it(`should return not found error`, async () => {
    const req: any = {
      params: {
        topicId: -1,
      },
    };
    const res: any = null;
    const next = () => {};
    await expect(
      extractCurrentTopicMiddleware.use(req, res, next),
    ).rejects.toThrow();
  });
});
