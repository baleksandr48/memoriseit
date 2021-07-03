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
import { TopicService } from './topic.service';
import { Topic } from '../../models/topic.model';
import {
  TopicApi,
  TopicCreate,
  topicCreateSchema,
  TopicUpdate,
  topicUpdateSchema,
} from './types-and-schemas';
import { validate } from '../../utils/validate';
import { User } from '../../models/user.model';
import { UserAuthorizedGuard } from '../../guard/user-authorized';
import { IsTopicCreatorGuard } from '../../guard/is-topic-creator';
import { IsTopicContributorGuard } from '../../guard/is-topic-contributor';
import { PayloadValue } from '../../decorators/context-value';
import { TestResults } from '../../models/test-results.model';

@Controller()
export class TopicController {
  constructor(private topicService: TopicService) {}

  @UseGuards(UserAuthorizedGuard)
  @Get('page/topics/contributed')
  getContributedTopics(
    @PayloadValue('currentUser') currentUser: User,
  ): Promise<Topic[]> {
    return this.topicService.getTopicsContributedByUser(currentUser);
  }

  @UseGuards(IsTopicContributorGuard)
  @Get('page/topic/:topicId')
  async getTopicPageForManaging(
    @Param('topicId', ParseIntPipe) topicId: number,
  ): Promise<TopicApi> {
    return this.topicService.getTopicPage(topicId);
  }

  @Get('page/exams')
  async getTopicsForExams(
    @PayloadValue('currentUser') currentUser: User,
  ): Promise<{ topics: TopicApi[]; testResults: TestResults[] }> {
    return this.topicService.getTopicsForExams(currentUser);
  }

  @UseGuards(UserAuthorizedGuard)
  @Post('topics')
  async create(
    @PayloadValue('currentUser') currentUser: User,
    @Body() body: TopicCreate | unknown,
  ) {
    const topicCreate: TopicCreate = validate(topicCreateSchema, body);
    return this.topicService.create(topicCreate, currentUser);
  }

  @UseGuards(IsTopicCreatorGuard)
  @Put('topic/:topicId')
  async update(
    @Param('topicId', ParseIntPipe) topicId: number,
    @Body() body: TopicUpdate | unknown,
  ) {
    const topicUpdate: TopicUpdate = validate(topicUpdateSchema, body);
    return this.topicService.update(topicId, topicUpdate);
  }

  @UseGuards(IsTopicCreatorGuard)
  @Delete('topic/:topicId')
  async delete(@Param('topicId', ParseIntPipe) topicId: number) {
    return this.topicService.delete(topicId);
  }
}
