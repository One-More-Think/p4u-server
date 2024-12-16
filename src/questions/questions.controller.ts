import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { User } from 'auth/user.decorator';
import { AccessTokenPayload } from 'auth/types';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';

@ApiTags('Question')
@Controller({ path: 'questions' })
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly commentsService: CommentsService,
  ) {}

  @ApiOperation({
    summary: 'Get Questions',
    description: `Get a list of questions.<br>If offset is 0 and limit is 10, it will return the first 10 questions.<br>If offset is 1 and limit is 10, it will return the next 10 questions.<br><br>**Offset's default value** is \`0\` and **limit's default value** is \`10\`.`,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    required: false,
    description: 'Offset means page.',
    example: 0,
    default: 0,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Limit means the number of questions per page.',
    example: 10,
    default: 10,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by title or description.',
    example: 'question',
    default: null,
  })
  @Get()
  async getQuestions(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Query('search') search: string | null = null,
  ) {
    return await this.questionsService.getQuestions(search, +offset, +limit);
  }

  @ApiOperation({ summary: 'Create Question' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createQuestion(
    @User() user: AccessTokenPayload,
    @Body() dto: CreateQuestionDto,
  ) {
    return await this.questionsService.createQuestion(dto, user.id);
  }

  @ApiOperation({
    summary: 'Get Question',
    description: 'Get a question by questionId.',
  })
  @ApiParam({
    name: 'questionId',
    type: Number,
    description: 'Question ID',
    example: 1,
  })
  @Get(':questionId')
  async getQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return await this.questionsService.getQuestionById(questionId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':questionId/comments')
  async createComment(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: CreateCommentDto,
    @User() user: AccessTokenPayload,
  ) {
    return await this.commentsService.createComment(
      questionId,
      user.id,
      dto.context,
    );
  }
}
