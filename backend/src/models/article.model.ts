import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { TABLE_NAME } from '../constants';
import { Topic } from './topic.model';
import { Test } from './test.model';

@Entity(TABLE_NAME.ARTICLE)
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  title!: string;

  @Column({
    nullable: true,
    default: '',
  })
  text: string = '';

  @Column({
    nullable: false,
  })
  topicId!: number;

  @Column({
    nullable: false,
    default: false,
  })
  isGroup: boolean = false;

  @ManyToOne(
    type => Topic,
    topic => topic.childArticles,
    { nullable: false, onDelete: 'CASCADE' },
  )
  topic?: Topic;

  @Column({
    nullable: true,
    default: null,
  })
  parentId?: number;

  @OneToMany(
    type => Article,
    article => article.parent,
  )
  children?: Article[];

  @OneToMany(
    type => Test,
    test => test.article,
    { cascade: true },
  )
  tests?: Test[];

  @ManyToOne(
    type => Article,
    article => article.children,
    { nullable: true, onDelete: 'CASCADE' },
  )
  parent?: Article;

  @Column({
    nullable: false,
  })
  order!: number;
}
