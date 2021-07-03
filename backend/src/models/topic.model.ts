import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TABLE_NAME } from '../constants';
import { Contributor } from './contributor.model';
import { TableOfContents } from '../controllers/topic/types-and-schemas';
import { Article } from './article.model';

@Entity(TABLE_NAME.TOPIC)
export class Topic {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  name!: string;

  @Column({
    default: '',
  })
  description!: string;

  @OneToMany(
    () => Contributor,
    contributor => contributor.topic,
    { cascade: true },
  )
  contributors?: Contributor[];

  @OneToMany(
    () => Article,
    article => article.topic,
    { cascade: true },
  )
  childArticles?: Article[];
}
