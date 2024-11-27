import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Option } from './option.entity';
import { Comment } from './comment.entity';

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

  @Column('int')
  writerId: number; // FK

  @Column('varchar', { length: 30, nullable: true })
  language?: string;

  @Column({ type: 'enum', enum: CATEGORY, nullable: true })
  category?: CATEGORY;

  @Column('varchar', { length: 300 })
  title: string;

  @Column('varchar', { length: 500, nullable: true })
  description?: string;

  @Column('smallint', { nullable: true })
  report?: number; // null? or default 0?

  @CreateDateColumn()
  createdAt: Date;

  // relations
  @ManyToOne(() => User, (user) => user.writtenQuestions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // when user is deleted, delete all questions by writer?
  })
  @JoinColumn({ name: 'writerId' })
  writer: User;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];

  @OneToMany(() => Comment, (comment) => comment.question)
  comments: Comment[];
}
