import { Comment } from 'questions/entities/comment.entity';
import { Question } from 'questions/entities/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOption } from './user-option.entity';
import { CommentReaction } from './comment-reaction.entity';
import { CommentReport } from 'questions/entities/comment-report.entity';
import { QuestionReport } from 'questions/entities/question-report.entity';

@Entity({ name: 'users', comment: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300, nullable: true }) // mvp: no unique
  snsId?: string;

  @Column({ length: 30, nullable: true })
  snsType: string;

  @Column({ length: 300, nullable: true }) // mvp: no unique
  email: string;

  @Column({ length: 30, nullable: true })
  country?: string;

  @Column({ length: 30, nullable: true })
  language?: string;

  @Column({ length: 30, nullable: true })
  gender?: string;

  @Column('smallint', { default: 0 })
  age?: number;

  @Column({ length: 100, nullable: true })
  occupation?: string;

  @Column({ length: 300, nullable: true, comment: 'aboutme' })
  aboutMe?: string;

  @Column('boolean', { default: false })
  isBanned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // relations
  @OneToMany(() => Question, (question) => question.writer)
  writtenQuestions: Question[];

  @OneToMany(() => Comment, (comment) => comment.writer)
  writtenComments: Comment[];

  @OneToMany(() => UserOption, (userOption) => userOption.user)
  selectedOptions: UserOption[];

  @OneToMany(() => CommentReaction, (commentReaction) => commentReaction.user)
  commentReactions: CommentReaction[];

  @OneToMany(() => CommentReport, (commentReport) => commentReport.user)
  commentReports: CommentReport[];

  @OneToMany(() => QuestionReport, (questionReport) => questionReport.user)
  questionReports: QuestionReport[];

  static create(snsId: string, snsType: string, email: string) {
    const user = new User();
    user.snsId = snsId;
    user.snsType = snsType;
    user.email = email;
    return user;
  }
}
