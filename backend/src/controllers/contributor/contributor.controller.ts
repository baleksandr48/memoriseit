import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContributorService } from './contributor.service';
import { validate } from '../../utils/validate';
import {
  ContributorCreate,
  contributorCreateSchema,
} from './types-and-schemas';
import { IsTopicCreatorGuard } from '../../guard/is-topic-creator';
import { Topic } from '../../models/topic.model';
import { PayloadValue } from '../../decorators/context-value';
import { ContextContainsGuard } from '../../guard/context-contains';
import { Contributor } from '../../models/contributor.model';

@Controller()
export class ContributorController {
  constructor(private contributorService: ContributorService) {}

  @UseGuards(IsTopicCreatorGuard)
  @Delete('topic/:topicId/contributor/:contributorId')
  async delete(
    @Param('topicId', ParseIntPipe) topicId: number,
    @Param('contributorId', ParseIntPipe) contributorId: number,
  ) {
    return this.contributorService.delete(topicId, contributorId);
  }

  @UseGuards(IsTopicCreatorGuard, new ContextContainsGuard('topic'))
  @Post('topic/:topicId/contributors')
  async create(
    @PayloadValue('topic') topic: Topic,
    @Body() body: unknown,
  ): Promise<Contributor> {
    const contributorCreate = validate<ContributorCreate>(
      contributorCreateSchema,
      body,
    );
    return this.contributorService.addContributor(topic, contributorCreate);
  }
}
