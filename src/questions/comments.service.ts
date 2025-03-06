import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { QuestionsService } from './questions.service';
import { CommentReaction } from 'users/entities/comment-reaction.entity';
import { CommentReport } from './entities/comment-report.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private questionsService: QuestionsService,
  ) {}

  async getComments(questionId: number) {
    try {
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .select([
          'comment.id',
          'comment.context',
          'comment.createdAt',
          'writer.id',
          'writer.country',
          'writer.age',
          'writer.occupation',
          'writer.gender',
        ])
        .leftJoin('comment.writer', 'writer')
        .where('comment.questionId = :questionId', { questionId })
        .orderBy('comment.createdAt', 'DESC')
        .getMany();

      return comments;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createComment(questionId: number, writerId: number, context: string) {
    try {
      const question = await this.questionsService.getQuestionById(
        questionId,
        writerId,
      ); // check exist question
      if (!question) {
        throw new NotFoundException(`Question ID ${questionId} not found.`);
      }
      const comment = this.commentRepository.create({
        questionId,
        writerId,
        context,
      });
      await this.commentRepository.save(comment);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async reactToComment(
    commentId: number,
    userId: number,
    isLike: boolean,
    isDislike: boolean,
  ) {
    try {
      if (isLike && isDislike) {
        throw new BadRequestException(
          'You can only like or dislike a comment.',
        );
      }
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });
      if (!comment) {
        throw new NotFoundException(`Comment ID ${commentId} not found.`);
      }

      // start transaction
      await this.commentRepository.manager.transaction(async (manager) => {
        // check exist reaction
        const existReaction = await manager.findOne(CommentReaction, {
          where: { commentId, userId },
        });
        if (existReaction) {
          if (isLike) {
            existReaction.isLike = true;
            existReaction.isDislike = false;
          } else if (isDislike) {
            existReaction.isLike = false;
            existReaction.isDislike = true;
          } else {
            existReaction.isLike = false;
            existReaction.isDislike = false;
          }
          await manager.save(existReaction);
        } else {
          const newReaction = manager.create(CommentReaction, {
            commentId,
            userId,
            isLike,
            isDislike,
          });
          await manager.save(newReaction);
        }

        const commentReactions = await manager.find(CommentReaction, {
          where: { commentId },
        });
        comment.like = commentReactions.filter(
          (reaction) => reaction.isLike,
        ).length;
        comment.dislike = commentReactions.filter(
          (reaction) => reaction.isDislike,
        ).length;
        await manager.save(comment);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async reportToComment(commentId: number, reporterId: number) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });

      if (!comment) {
        throw new NotFoundException(`Comment ID ${commentId} not found.`);
      }

      await this.commentRepository.manager.transaction(async (manager) => {
        const reportedComments = await manager.find(CommentReport, {
          where: { id: commentId },
        });

        // check reportedComment has reporterId
        reportedComments.forEach((report) => {
          if (report.userId === reporterId) {
            throw new BadRequestException(
              'You have already reported this comment.',
            );
          }
        });

        if (reportedComments.length >= 2) {
          // CommentReport will delete by cascade
          await manager.delete(Comment, { id: commentId });
        } else {
          await manager.save(CommentReport, { commentId, userId: reporterId });
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteComment(commentId: number) {
    try {
      await this.commentRepository.delete({ id: commentId });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
