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
import { QuestionReport } from './question-report.entity';

export enum CATEGORY {
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

  @Column('varchar', { length: 30, default: 'en' })
  language: string;

  @Column({ type: 'enum', enum: CATEGORY, default: CATEGORY.LIVING })
  category: CATEGORY;

  @Column('varchar', { length: 300 })
  title: string;

  @Column('varchar', { length: 500, nullable: true })
  description?: string;

  @Column('smallint', { default: 0 })
  report: number;

  @Column('bigint', { default: 0 })
  timeout: number;

  @CreateDateColumn()
  createdAt: Date;

  // relations
  @ManyToOne(() => User, (user) => user.writtenQuestions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'writerId' })
  writer: User;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];

  @OneToMany(() => Comment, (comment) => comment.question)
  comments: Comment[];

  @OneToMany(() => QuestionReport, (questionReport) => questionReport.question)
  reports: QuestionReport[];
}
