import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from 'questions/entities/question.entity';
import { User } from 'users/entities/user.entity';

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
  question: Question;
}
