import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../../models/article.model';
import { Contributor } from '../../models/contributor.model';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TestModule } from '../test/test.module';
import { Topic } from '../../models/topic.model';
import { TopicModule } from '../topic/topic.module';
import { ExtractCurrentArticleMiddleware } from '../../middlewares/extract-current-article.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Topic, Contributor]),
    TestModule,
    forwardRef(() => TopicModule),
  ],
  providers: [ArticleService],
  exports: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractCurrentArticleMiddleware)
      .forRoutes(
        'topic/:topicId/article/:articleId',
        'page/topic/:topicId/article/:articleId',
      );
  }
}
