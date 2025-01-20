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
import { Question } from './question.entity';
import { CommentReaction } from 'users/entities/comment-reaction.entity';

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
  like: number;

  @Column('int', { default: 0 })
  dislike: number;

  @Column('int', { default: 0 })
  report: number;

  @CreateDateColumn()
  createdAt: Date;

  // relations
  @ManyToOne(() => User, (user) => user.writtenComments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'writerId' })
  writer: User;

  @ManyToOne(() => Question, (question) => question.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  question: Question;

  @OneToMany(() => CommentReaction, (commentReaction) => commentReaction.comment)
  reactions: CommentReaction[];
}
