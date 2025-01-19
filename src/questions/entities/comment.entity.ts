import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Question } from './question.entity';

@Entity({ name: 'comments', comment: 'Commented on question' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  writerId: number; // FK

  @Column('int')
  questionId: number; // FK

  @Column('varchar', { length: 100, nullable: true })
  context: string;

  @Column('int', { default: 0 })
  like: number; // FK

  @Column('int', { default: 0 })
  report: number; // FK

  @CreateDateColumn()
  createdAt: Date;

  // relations
  @ManyToOne(() => User, (user) => user.writtenComments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // when user is deleted, delete all comments by writer?
  })
  @JoinColumn({ name: 'writerId' })
  writer: User;

  @ManyToOne(() => Question, (question) => question.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
