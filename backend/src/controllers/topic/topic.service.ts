import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../../models/article.model';
import { Repository, Connection } from 'typeorm/index';
import { CONTRIBUTOR_TYPE, TABLE_NAME } from '../../constants';
import { Topic } from '../../models/topic.model';
import arrayToTree from 'array-to-tree';
import {
  ArticleTree,
  TableOfContents,
  TopicApi,
  TopicCreate,
  TopicUpdate,
} from './types-and-schemas';
import { ArticleService } from '../articles/article.service';
import { forEachTree, mapTree } from '../../utils/tree-utils';
import { User } from '../../models/user.model';
import { TestResults } from '../../models/test-results.model';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
    @InjectRepository(TestResults)
    private testResultsRepository: Repository<TestResults>,
    private connection: Connection,
    @Inject(forwardRef(() => ArticleService))
    private articleService: ArticleService,
  ) {}

  async getTopicsContributedByUser(currentUser: User) {
    return this.topicRepository
      .createQueryBuilder(TABLE_NAME.TOPIC)
      .innerJoinAndSelect(
        `${TABLE_NAME.TOPIC}.contributors`,
        TABLE_NAME.CONTRIBUTOR,
        `${TABLE_NAME.CONTRIBUTOR}.userId = :userId`,
        { userId: currentUser.id },
      )
      .getMany();
  }

  async getTopicsForExams(currentUser: User) {
    const topics = await this.topicRepository.find();
    const topicsWithTableOfContents = await Promise.all(
      topics.map(async topic => {
        const tableOfContents = await this.getTableOfContents(
          topic.id,
          topic.name,
        );
        return {
          ...topic,
          tableOfContents,
        };
      }),
    );
    const testResults = await this.testResultsRepository.find({
      where: {
        userId: currentUser.id,
      },
    });
    return { topics: topicsWithTableOfContents, testResults };
  }

  async getTopicPage(topicId: number): Promise<TopicApi> {
    const topic = await this.topicRepository.findOne(topicId, {
      relations: ['contributors', 'contributors.user'],
    });
    if (!topic) {
      throw new NotFoundException(`Topic ${topicId} is not found`);
    }
    const tableOfContents = await this.getTableOfContents(topic.id, topic.name);
    return {
      ...topic,
      tableOfContents,
    };
  }

  buildArticleTrees(articles: Article[]): Article[] {
    return arrayToTree(articles, {
      parentProperty: 'parentId',
    });
  }

  async getArticleTrees(topicId: number): Promise<Article[]> {
    const childArticles = await this.articleService.getAllChildArticles(
      topicId,
    );
    return this.buildArticleTrees(childArticles);
  }

  async getTableOfContents(
    topicId: number,
    topicName: string,
  ): Promise<TableOfContents> {
    const articles = await this.articleService.getAllChildArticles(topicId);
    const articleTrees: ArticleTree[] = this.buildArticleTrees(articles);
    const tableOfContents: ArticleTree = {
      id: 0,
      title: topicName,
      isGroup: true,
      order: 0,
      children: articleTrees,
    };
    forEachTree(tableOfContents, toc => {
      if (toc.children) {
        toc.children = toc.children.sort((a, b) => {
          if (a.order > b.order) {
            return -1;
          }
          return 1;
        });
      }
    });
    return mapTree<ArticleTree, TableOfContents>(tableOfContents, toc => {
      return {
        id: toc.id,
        title: toc.title,
        children: toc.children,
      };
    }) as TableOfContents;
  }

  async create(topicCreate: TopicCreate, currentUser: User): Promise<Topic> {
    return this.topicRepository.save({
      ...topicCreate,
      contributors: [
        {
          type: CONTRIBUTOR_TYPE.CREATOR,
          userId: currentUser.id,
        },
      ],
    });
  }

  async update(topicId: number, topicUpdate: TopicUpdate): Promise<void> {
    await this.topicRepository.update(topicId, topicUpdate);
  }

  async delete(topicId: number): Promise<void> {
    await this.topicRepository.delete(topicId);
  }

  async getTopicById(topicId: number) {
    return this.topicRepository.findOne(topicId);
  }
}
