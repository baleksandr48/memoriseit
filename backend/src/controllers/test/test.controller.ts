import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TestService } from './test.service';
import {
  TestCreate,
  TestForChecking,
  testSaveSchema,
  testsForCheckingSchema,
  TestUpdate,
} from './types-and-schemas';
import { validate } from '../../utils/validate';
import { Test } from '../../models/test.model';
import { IsTopicContributorGuard } from '../../guard/is-topic-contributor';
import { PayloadValue } from '../../decorators/context-value';
import { User } from '../../models/user.model';

@Controller()
export class TestController {
  constructor(private testService: TestService) {}

  @UseGuards(IsTopicContributorGuard)
  @Put('topic/:topicId/article/:articleId/tests')
  async saveTestsForArticle(
    @Body() body: any,
    @Param('articleId', ParseIntPipe) articleId: number,
  ) {
    const testsForArticle: Array<TestUpdate | TestCreate> = validate(
      testSaveSchema,
      body,
    );
    await this.testService.saveTestsForArticle(articleId, testsForArticle);
  }

  @Post('topic/:topicId/article/:articleId/tests/check')
  async checkResults(
    @Body() body: any,
    @Param('articleId', ParseIntPipe) articleId: number,
    @PayloadValue('currentUser') currentUser: User,
  ) {
    const testsForChecking: TestForChecking[] = validate(
      testsForCheckingSchema,
      body,
    );
    const testsWithAnswers = await this.testService.checkResults(
      articleId,
      testsForChecking,
    );
    await this.testService.saveResults(
      articleId,
      testsWithAnswers,
      currentUser,
    );
    return testsWithAnswers;
  }

  @Get('page/topic/:topicId/article/:articleId/tests')
  async getTestsForArticle(
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<Test[]> {
    return this.testService.getTestsForArticle(articleId);
  }
}
