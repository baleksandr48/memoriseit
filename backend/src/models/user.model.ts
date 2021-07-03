import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TABLE_NAME } from '../constants';
import { OneToMany } from 'typeorm/index';
import { Contributor } from './contributor.model';
import { TestResults } from './test-results.model';

@Entity(TABLE_NAME.USER)
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  name!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email!: string;

  @OneToMany(
    () => Contributor,
    contributor => contributor.user,
    { cascade: true },
  )
  contributes?: Contributor[];

  @OneToMany(
    () => TestResults,
    testResult => testResult.user,
  )
  testResults?: TestResults[];
}
