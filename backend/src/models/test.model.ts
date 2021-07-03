import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TABLE_NAME, TEST_TYPE } from '../constants';
import { TestAnswers } from '../controllers/test/types-and-schemas';
import { ManyToOne } from 'typeorm/index';
import { Article } from './article.model';

@Entity(TABLE_NAME.TEST)
export class Test {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  question!: string;

  @Column({
    type: 'enum',
    enum: TEST_TYPE,
    nullable: false,
  })
  type!: string;

  @Column({ type: 'json', nullable: false })
  answers!: TestAnswers;

  @Column({ nullable: false })
  articleId!: number;

  @ManyToOne(
    type => Article,
    article => article.tests,
    { nullable: false, onDelete: 'CASCADE' },
  )
  article?: Article;
}
