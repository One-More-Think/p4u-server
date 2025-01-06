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
      const userOptions = await this.userOptionRepository.findOne({
        where: { userId, optionId: In(optionIds), questionId: dto.questionId },
      });

      if (userOptions) {
        userOptions['optionId'] = dto.optionId;
        await this.userOptionRepository.save(userOptions);
      } else {
        const uo = UserOption.create(userId, dto.optionId, dto.questionId);
        await this.userOptionRepository.save(uo);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
