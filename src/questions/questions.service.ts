import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
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
}
