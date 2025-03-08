import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from 'questions/entities/comment.entity';

@Entity({ name: 'comment_reactions', comment: 'Reactions to comments' })
export class CommentReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number; // FK

  @Column('int')
  commentId: number; // FK

  @Column('boolean', { default: false })
  isLike: boolean;

  @Column('boolean', { default: false })
  isDislike: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // relations
  @ManyToOne(() => User, (user) => user.commentReactions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.reactions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  comment: Comment;
}
