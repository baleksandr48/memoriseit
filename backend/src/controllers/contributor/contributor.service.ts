import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm/index';
import { CONTRIBUTOR_TYPE } from '../../constants';
import { Contributor } from '../../models/contributor.model';
import { ContributorCreate } from './types-and-schemas';
import { User } from '../../models/user.model';
import { EmailService } from '../../email/email.service';
import { Topic } from '../../models/topic.model';

@Injectable()
export class ContributorService {
  constructor(
    @InjectRepository(Contributor)
    private contributorRepository: Repository<Contributor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
    @InjectConnection()
    private connection: Connection,
    private readonly emailService: EmailService,
  ) {}

  async delete(topicId: number, contributorId: number) {
    const contributor = await this.contributorRepository.findOne(contributorId);
    if (!contributor) {
      throw new BadRequestException(`Contributor is not found.`);
    }
    if (contributor.type === CONTRIBUTOR_TYPE.CREATOR) {
      throw new BadRequestException(`Can't remove creator.`);
    }
    await this.contributorRepository.delete(contributorId);
  }

  async addContributor(
    topic: Topic,
    contributorCreate: ContributorCreate,
  ): Promise<Contributor> {
    return this.connection.transaction(async transactionalEntityManager => {
      const userRepository = transactionalEntityManager.getRepository<User>(
        User,
      );
      const contributorRepository = transactionalEntityManager.getRepository<
        Contributor
      >(Contributor);
      let user = await userRepository.findOne({
        where: {
          email: contributorCreate.email,
        },
        relations: ['contributes'],
      });
      if (!user) {
        const name = contributorCreate.email.split('@')[0];
        user = await userRepository.save({
          email: contributorCreate.email,
          name,
        });
      }
      if (
        user.contributes?.some(contributor => contributor.topicId === topic.id)
      ) {
        throw new BadRequestException(`User already contributes this topic.`);
      }
      const contributor = await contributorRepository.save({
        topic,
        type: CONTRIBUTOR_TYPE.EDITOR,
        user,
      });
      await this.emailService.sendEmail(
        user.email,
        `Invitation to contribute the topic ${topic.name}`,
        `Hi :) You are invited to contribute the topic ${topic.name}`,
      );
      return contributor;
    });
  }
}
