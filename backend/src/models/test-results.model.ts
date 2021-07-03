import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TABLE_NAME } from '../constants';
import { CreateDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm/index';
import { User } from './user.model';
import { Article } from './article.model';

@Entity(TABLE_NAME.TEST_RESULTS)
export class TestResults {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => User,
    user => user.testResults,
    { onDelete: 'CASCADE' },
  )
  user?: User;

  @Column({
    nullable: false,
  })
  userId!: number;

  @ManyToOne(() => Article)
  article?: Article;

  @Column({
    nullable: false,
  })
  articleId!: number;

  @Column({
    nullable: false,
    type: 'float',
  })
  result!: number;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt!: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt!: Date;
}
