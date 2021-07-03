import {
  Entity,
  Column,
  ManyToOne,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CONTRIBUTOR_TYPE, TABLE_NAME } from '../constants';
import { Topic } from './topic.model';
import { User } from './user.model';

@Entity(TABLE_NAME.CONTRIBUTOR)
@Index(['topicId', 'userId'], { unique: true })
export class Contributor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  topicId!: number;

  @ManyToOne(
    () => Topic,
    topic => topic.contributors,
    { onDelete: 'CASCADE' },
  )
  topic?: Topic;

  @ManyToOne(
    () => User,
    user => user.contributes,
    { onDelete: 'CASCADE' },
  )
  user?: User;

  @Column({
    nullable: false,
  })
  userId!: number;

  @Column({
    type: 'enum',
    enum: CONTRIBUTOR_TYPE,
  })
  type!: CONTRIBUTOR_TYPE;
}
