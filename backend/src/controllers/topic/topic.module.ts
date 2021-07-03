import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { Topic } from '../../models/topic.model';
import { ArticleModule } from '../articles/article.module';
import { ExtractCurrentTopicMiddleware } from '../../middlewares/extract-current-topic.middleware';
import { TestResults } from '../../models/test-results.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, TestResults]),
    forwardRef(() => ArticleModule),
  ],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractCurrentTopicMiddleware)
      .forRoutes('topic/:topicId', 'page/topic/:topicId');
  }
}
