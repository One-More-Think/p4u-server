import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CATEGORY, Question } from './entities/question.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Option } from './entities/option.entity';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionReport } from './entities/question-report.entity';

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

  async getQuestionsByFilter(
    category: CATEGORY,
    sort: string, // Recent, View, Comment, Progress
    age: string, // 10s, 20s, 30s, 40s, 50s, 60s, ...
    gender: string, // Male, Female, None
    country: string, // AF, AL, DZ, ... ZW
    offset: number,
    limit: number,
  ) {
    try {
      const qb = this.questionRepository
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
        .leftJoin('question.writer', 'writer');

      if (category) {
        console.log('Added category filter');
        qb.andWhere('question.category = :category', { category });
      }

      if (age) {
        console.log('Added age filter');
        // if age is 10s, bring all users whose age is between 10 and 19
        const minAge = +age.slice(0, -1);
        qb.andWhere('writer.age BETWEEN :min AND :max', {
          min: minAge,
          max: minAge + 9,
        });
      }

      if (gender !== undefined) {
        console.log('Added gender filter');
        qb.andWhere('writer.gender = :gender', { gender });
      }

      if (country) {
        console.log('Added country filter');
        qb.andWhere('writer.country = :country', { country });
      }

      // if (sort) {
      //   console.log('Added sort filter');
      //   switch (sort) {
      //     case 'recent':
      //       qb.orderBy('question.id', 'DESC');
      //       break;
      //     // case 'view': >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> todo
      //     //   qb.orderBy('question.views', 'DESC');
      //     // break;
      //     // case 'comment': // compare with the number of comments >>>>>>> todo
      //     //   qb.orderBy('question.comments', 'DESC');
      //     //   break;
      //     // case 'progress':
      //     //   qb.orderBy('question.progress', 'DESC');
      //     //   break;
      //     default:
      //       qb.orderBy('question.id', 'DESC'); // default is recent
      //   }
      // } else {
      //   qb.orderBy('question.id', 'DESC');
      // }

      qb.orderBy('question.id', 'DESC'); // default
      return await qb
        .skip(limit * offset)
        .take(limit)
        .getMany();
    } catch (error) {
      console.log(error.message);
      throw error;
    }
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
      comment.like = comment.reactions.filter(
        (reaction) => reaction.isLike,
      ).length;
      comment.dislike = comment.reactions.filter(
        (reaction) => reaction.isDislike,
      ).length;
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
        // update question
        await manager.update(Question, questionId, {
          category: dto.category,
          title: dto.title,
          description: dto.description,
        });
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async reportToQuestion(questionId: number, reporterId: number) {
    try {
      const question = await this.questionRepository.findOne({
        where: { id: questionId },
      });

      if (!question) {
        throw new NotFoundException(`Question ID ${questionId} not found.`);
      }

      await this.questionRepository.manager.transaction(async (manager) => {
        const reportedQuestions = await manager.find(QuestionReport, {
          where: { questionId },
        });

        // check reportedQuestion has reporterId
        reportedQuestions.forEach((report) => {
          if (report.userId === reporterId) {
            throw new BadRequestException(
              'You have already reported this question.',
            );
          }
        });

        if (reportedQuestions.length >= 2) {
          // QuestionReport will delete by cascade
          await manager.delete(Question, { id: questionId });
          await manager.delete(QuestionReport, { questionId });
        } else {
          await manager.save(QuestionReport, {
            questionId,
            userId: reporterId,
          });
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
