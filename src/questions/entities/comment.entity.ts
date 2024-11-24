import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from 'questions/entities/question.entity';
import { User } from 'users/entities/user.entity';

@Entity({ name: 'comments', comment: 'Commented on question' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.commentedQuestions)
  writer: User;

  @ManyToOne(() => Question, (question) => question.comments)
  question: Question;

  @Column('varchar', { length: 100, nullable: true })
  context: string;

  @CreateDateColumn()
  createdAt: Date;
}
