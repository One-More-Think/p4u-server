import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Comment } from 'questions/entities/comment.entity';

@Entity({ name: 'comment_report', comment: 'Report to comments' })
export class CommentReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number; // FK

  @Column('int')
  commentId: number; // FK

  @CreateDateColumn()
  createdAt: Date;

  @Column('boolean', { default: true })
  isReported: boolean;

  // relations
  @ManyToOne(() => User, (user) => user.commentReports, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.reports, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  comment: Comment;
}
