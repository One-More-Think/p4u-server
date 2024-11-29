import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';

@ApiTags('Question')
@Controller({ path: 'questions' })
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiOperation({ summary: 'Get Questions' })
  @Get()
  async getQuestions() {
    return await this.questionsService.getQuestions();
  }
}
