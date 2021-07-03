import { ContributorService } from './contributor.service';
import { Test as NestJsTest, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../config';
import { Connection, Repository } from 'typeorm/index';
import { Topic } from '../../models/topic.model';
import { forwardRef } from '@nestjs/common';
import { Contributor } from '../../models/contributor.model';
import { User } from '../../models/user.model';
import { ContributorModule } from './contributor.module';
import { CONTRIBUTOR_TYPE } from '../../constants';
import { EmailService } from '../../email/email.service';
import { EmailModule } from '../../email/email.module';

describe('ContributorService', () => {
  let contributorService: ContributorService;
  let connection: Connection;
  let topicRepository: Repository<Topic>;
  let contributorRepository: Repository<Contributor>;
  let userRepository: Repository<User>;
  let emailService: EmailService;

  beforeAll(async () => {
    const testModule: TestingModule = await NestJsTest.createTestingModule({
      imports: [
        EmailModule,
        TypeOrmModule.forRoot(config.db),
        TypeOrmModule.forFeature([Topic, User, Contributor]),
        forwardRef(() => ContributorModule),
      ],
      providers: [ContributorService],
    }).compile();
    contributorService = testModule.get<ContributorService>(ContributorService);
    connection = testModule.get<Connection>(Connection);
    topicRepository = testModule.get<Repository<Topic>>(
      getRepositoryToken(Topic),
    );
    userRepository = testModule.get<Repository<User>>(getRepositoryToken(User));
    contributorRepository = testModule.get<Repository<Contributor>>(
      getRepositoryToken(Contributor),
    );
    emailService = testModule.get<EmailService>(EmailService);

    jest
      .spyOn(emailService, 'sendEmail')
      .mockImplementation(() => Promise.resolve());
  });

  afterAll(async () => {
    await connection.close();
  });

  describe(`create method`, () => {
    let topic: Topic;

    beforeEach(async () => {
      await topicRepository.delete({});
      await userRepository.delete({});
      topic = await topicRepository.save({
        name: 'topic name',
        description: 'description',
      });
    });

    it(`should add contributor and user`, async () => {
      await contributorService.addContributor(topic, {
        email: 'alex@email.com',
      });
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].name).toEqual('alex');
      const contributors = await contributorRepository.find();
      expect(contributors).toHaveLength(1);
      expect(contributors[0].topicId).toEqual(topic.id);
    });

    it(`should add only contributor`, async () => {
      const user = await userRepository.save({
        name: 'user name',
        email: 'some@email.com',
      });
      await contributorService.addContributor(topic, {
        email: user.email,
      });
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
    });

    it(`should throw an error. User already contributes the topic.`, async () => {
      const user = await userRepository.save({
        name: 'user name',
        email: 'some@email.com',
      });
      await contributorService.addContributor(topic, {
        email: user.email,
      });
      await expect(
        contributorService.addContributor(topic, {
          email: user.email,
        }),
      ).rejects.toThrow();
    });
  });

  describe(`delete method`, () => {
    let topic: Topic;
    let user: User;

    beforeEach(async () => {
      await topicRepository.delete({});
      await userRepository.delete({});
      topic = await topicRepository.save({
        name: 'topic name',
        description: 'description',
      });
      user = await userRepository.save({
        name: 'username',
        email: 'alex@email.com',
      });
    });

    it(`should delete contributor`, async () => {
      const contributor = await contributorRepository.save({
        topic,
        user,
        type: CONTRIBUTOR_TYPE.EDITOR,
      });
      await contributorService.delete(topic.id, contributor.id);
      const contributors = await contributorRepository.find();
      expect(contributors).toHaveLength(0);
    });

    it(`should throw an error. User doesn't contribute a topic.`, async () => {
      await expect(
        contributorService.delete(topic.id, user.id),
      ).rejects.toThrow();
    });

    it(`should throw an error. Can't delete creator.`, async () => {
      await contributorRepository.save({
        topic,
        user,
        type: CONTRIBUTOR_TYPE.CREATOR,
      });
      await expect(
        contributorService.delete(topic.id, user.id),
      ).rejects.toThrow();
    });
  });
});
