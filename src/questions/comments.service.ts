import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { QuestionsService } from './questions.service';
import { CommentReaction } from 'users/entities/comment-reaction.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private questionsService: QuestionsService,
  ) { }

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
      const question = await this.questionsService.getQuestionById(questionId); // check exist question
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
      if (isLike === isDislike) {
        throw new BadRequestException('You can only like or dislike a comment.');
      }
      const comment = await this.commentRepository.findOne({ where: { id: commentId } });
      if (!comment) {
        throw new NotFoundException(`Comment ID ${commentId} not found.`);
      }

      // start transaction
      await this.commentRepository.manager.transaction(async (manager) => {
        if (isLike) {
          comment.like += 1;
        } else {
          comment.dislike += 1;
        }
        await manager.save(comment);

        // check exist reaction
        const existReaction = await manager.findOne(CommentReaction, {
          where: { commentId, userId },
        });
        if (existReaction) {
          if (isLike) {
            existReaction.isLike = true;
            existReaction.isDislike = false;
          } else {
            existReaction.isLike = false;
            existReaction.isDislike = true;
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
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
