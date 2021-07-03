import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExtractUserFromTokenMiddleware } from '../middlewares/extract-user-from-token.middleware';
import { ArticleModule } from './articles/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../models/article.model';
import { TopicModule } from './topic/topic.module';
import { TestModule } from './test/test.module';
import { Contributor } from '../models/contributor.model';
import { Test } from '../models/test.model';
import { Topic } from '../models/topic.model';
import { User } from '../models/user.model';
import { ContributorModule } from './contributor/contributor.module';
import { TestResults } from '../models/test-results.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Article,
      Topic,
      Test,
      Contributor,
      User,
      TestResults,
    ]),
    ArticleModule,
    TopicModule,
    TestModule,
    ContributorModule,
  ],
})
export class ControllersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExtractUserFromTokenMiddleware).forRoutes('*');
  }
}
