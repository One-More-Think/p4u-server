import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Option } from './entities/option.entity';
import { UpdateQuestionDto } from './dto/update-question.dto';

const MAX_ALLOWED_OPTIONS = 3;

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private dataSource: DataSource,
  ) {}

  async getQuestions(search: string, offset: number, limit: number) {
    return await this.questionRepository
      .createQueryBuilder('question')
      .select([
        'question.id',
        'question.title',
        'question.language',
        'writer.country',
        'writer.age',
        'writer.occupation',
        'writer.gender',
        'writer.id',
      ])
      .leftJoin('question.writer', 'writer')
      .where(
        search
          ? 'question.title LIKE :search OR question.description LIKE :search'
          : '1=1',
        { search: `%${search}%` },
      )
      .orderBy('question.id', 'DESC')
      .skip(limit * offset)
      .take(limit)
      .getMany();
  }

  async getQuestionById(questionId: number, userId: number) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: [
        'writer',
        'options',
        'comments',
        'comments.reactions',
        'comments.writer',
        'options.selectedUsers',
      ],
    });
    if (!question) {
      throw new NotFoundException(`Question ID ${questionId} not found.`);
    }
    question.comments.forEach((comment) => {
      delete comment.questionId;
      delete comment.writerId;
      comment.isLiked = comment.reactions.some(
        (reaction) => reaction.userId === userId && reaction.isLike,
      );
      comment.isDisliked = comment.reactions.some(
        (reaction) => reaction.userId === userId && reaction.isDislike,
      );
    });
    delete question.writer.snsId;
    delete question.writer.snsType;
    delete question.writer.email;
    delete question.writer.isBanned;
    delete question.writer.createdAt;
    delete question.writer.aboutMe;
    question.comments.map((comment) => {
      delete comment.reactions;
      delete comment.writer.snsId;
      delete comment.writer.snsType;
      delete comment.writer.email;
      delete comment.writer.isBanned;
      delete comment.writer.createdAt;
      delete comment.writer.aboutMe;
    });
    question.comments = question.comments.sort((a, b) => b.id - a.id);
    return question;
  }

  async createQuestion(dto: CreateQuestionDto, writerId: number) {
    if (dto.options.length > 3 || dto.options.length < 1) {
      throw new BadRequestException('Options must be between 1 and 3');
    }

    this.dataSource.transaction(async (manager) => {
      const question = manager.create(Question, {
        writerId,
        category: dto.category,
        title: dto.title,
        description: dto.description,
        timeout: Date.now() + dto.timeout,
      });
      await manager.save(question);

      const options = manager.create(
        Option,
        dto.options.map((option) => ({
          context: option,
          questionId: question.id,
        })),
      );
      await manager.save(options);
    });
    // return avoid or return question
  }

  async deleteQuestion(questionId: number, writerId: number) {
    try {
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
      });
      if (!question) {
        throw new NotFoundException(`Question ID ${questionId} not found.`);
      }
      if (question.writerId !== writerId) {
        throw new ForbiddenException(
          'You are not the writer of this question.',
        );
      }
      await this.questionRepository.delete({ id: questionId });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async updateQuestion(
    questionId: number,
    writerId: number,
    dto: UpdateQuestionDto,
  ) {
    try {
      // start transaction
      await this.dataSource.transaction(async (manager) => {
        const question = await manager.findOne(Question, {
          where: { id: questionId },
          relations: ['options'],
        });
        if (!question) {
          throw new NotFoundException(`Question ID ${questionId} not found.`);
        }
        if (question.writerId !== writerId) {
          throw new ForbiddenException(
            'You are not the writer of this question.',
          );
        }

        // update question
        await manager.update(Question, questionId, {
          // category??
          title: dto.title,
          description: dto.description,
        });

        // add new options
        if (dto.options.length !== 0) {
          const currentOptionCount = question.options.length;
          if (currentOptionCount + dto.options.length > MAX_ALLOWED_OPTIONS) {
            throw new BadRequestException(
              `Options must be between 1 and ${MAX_ALLOWED_OPTIONS}`,
            );
          }
          await manager.save(
            Option,
            dto.options.map((option) => ({
              context: option,
              questionId: question.id,
            })),
          );
        }
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}
