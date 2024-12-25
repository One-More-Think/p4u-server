import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserOption } from 'users/entities/user-option.entity';
import { ChooseOptionDto } from './dto/create-user-option.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class UserOptionsService {
  constructor(
    @InjectRepository(UserOption)
    private userOptionRepository: Repository<UserOption>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(userId: number, dto: ChooseOptionDto) {
    try {
      const question = await this.questionRepository.findOne({
        where: { id: dto.questionId },
        relations: ['options'],
      });
      if (!question) {
        throw new NotFoundException(`Question ID ${dto.questionId} not found.`);
      }
      const optionIds = question.options.map((option) => option.id);

      const userOptions = await this.userOptionRepository.find({
        where: { userId, optionId: In(optionIds) },
      });

      if (userOptions.length > 0) {
        throw new ForbiddenException('User already selected option.');
      }

      const uo = UserOption.create(userId, dto.optionId);
      await this.userOptionRepository.save(uo);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
