import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Option } from 'questions/entities/option.entity';
import { Comment } from 'questions/entities/comment.entity';

enum CATEGORY {
  LIVING,
  CAREER,
  FOOD,
  RELATIONSHIP,
}

@Entity({ name: 'questions', comment: 'Question' })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.writtenQuestions)
  writer: User;

  @Column('varchar', { length: 30, nullable: true })
  language?: string;

  @Column({ type: 'enum', enum: CATEGORY, nullable: true })
  category?: CATEGORY;

  @Column('varchar', { length: 300, nullable: true })
  title?: string;

  @Column('varchar', { length: 500, nullable: true })
  description?: string;

  @Column('smallint', { nullable: true })
  report?: number;

  @OneToMany(() => Option, (option) => option.question)
  options?: Option[];

  @OneToMany(() => Comment, (comment) => comment.question)
  comments?: Comment[];
}
