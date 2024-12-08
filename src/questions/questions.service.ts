import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Option } from './entities/option.entity';

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

  async getQuestionById(questionId: number) {
    return await this.questionRepository.findOne({ where: { id: questionId } });
  }

  async createQuestion(dto: CreateQuestionDto, writerId: number) {
    if (dto.options.length > 3 || dto.options.length < 1) {
      throw new BadRequestException('Options must be between 1 and 3');
    }

    this.dataSource.transaction(async (manager) => {
      const question = manager.create(Question, {
        writerId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
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
}
