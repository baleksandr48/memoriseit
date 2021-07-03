import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContributorService } from './contributor.service';
import { ContributorController } from './contributor.controller';
import { User } from '../../models/user.model';
import { Contributor } from '../../models/contributor.model';
import { EmailModule } from '../../email/email.module';
import { Topic } from '../../models/topic.model';

@Module({
  imports: [TypeOrmModule.forFeature([Contributor, User, Topic]), EmailModule],
  providers: [ContributorService],
  controllers: [ContributorController],
  exports: [ContributorService],
})
export class ContributorModule {}
