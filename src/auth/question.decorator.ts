import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'questions/entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionIsWriter implements CanActivate {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const questionId = request.params.questionId;

    if (!questionId) {
      throw new ForbiddenException('Question ID is required');
    }

    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException(`Question ID ${questionId} not found.`);
    }

    if (question.writerId !== user.id) {
      throw new ForbiddenException('You are not the writer of this question.');
    }

    return true;
  }
}
