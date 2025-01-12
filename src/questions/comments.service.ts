import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { QuestionsService } from './questions.service';

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
}
