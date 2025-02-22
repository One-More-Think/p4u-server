import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CATEGORY } from './entities/question.entity';

@ApiTags('Question')
@Controller({ path: 'questions' })
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly commentsService: CommentsService,
  ) { }

  @ApiOperation({
    summary: 'Get Questions',
    description:
      'Get a list of questions.<br>If offset is 0 and limit is 10, it will return the first 10 questions.<br>If offset is 1 and limit is 10, it will return the next 10 questions.<br><br>**Offset\'s default value** is `0` and **limit\'s default value** is `10`.',
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
  @ApiQuery({
    name: 'category',
    required: false,
    enum: CATEGORY,
    description: 'Filter by category.',
    default: null,
  })
  @ApiQuery({
    name: 'sort',
    type: String,
    required: false,
    description: 'Only `recent`, `view`, `comment` and `progress`',
    default: null,
  })
  @ApiQuery({
    name: 'age',
    type: String,
    required: false,
    description: 'Filter by only `10s`, `20s`, `30s`, `40s` and `50s`',
    default: null,
  })
  @ApiQuery({
    name: 'gender',
    type: String,
    required: false,
    description: 'Only `male` and `female`',
    default: null,
  })
  @ApiQuery({
    name: 'country',
    type: String,
    required: false,
    description: 'Filter by `Country Code`',
    default: null,
  })
  @Get()
  async getQuestions(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Query('search') search: string | null = null,
    @Query('category') category: CATEGORY | null = null,
    @Query('sort') sort: string | null = null,
    @Query('age') age: string | null = null,
    @Query('gender') gender: string | null = undefined, // specify undefined
    @Query('country') country: string | null = null,
  ) {
    console.log('search:', search);
    console.log('category:', category);
    console.log('sort:', sort);
    console.log('age:', age);
    console.log('gender', gender);
    console.log('country:', country);
    if (!search) {
      console.log('By Filters');
      return await this.questionsService.getQuestionsByFilter(
        category, sort, age, gender, country, +offset, +limit,
      );
    } else {
      console.log('By Search');
      return await this.questionsService.getQuestions(search, +offset, +limit);
    }
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':questionId')
  async getQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @User() user: AccessTokenPayload,
  ) {
    return await this.questionsService.getQuestionById(questionId, user.id);
  }

  @ApiOperation({
    summary: 'Delete Question',
    description: 'Delete a question by questionId.',
  })
  @ApiParam({
    name: 'questionId',
    type: Number,
    description: 'Question ID',
    example: 1,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':questionId')
  async deleteQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @User() user: AccessTokenPayload,
  ) {
    await this.questionsService.deleteQuestion(questionId, user.id);
  }

  @ApiParam({
    name: 'questionId',
    type: Number,
    description: 'Question ID',
    example: 1,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':questionId')
  async updateQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @User() user: AccessTokenPayload,
    @Body() dto: UpdateQuestionDto,
  ) {
    return await this.questionsService.updateQuestion(questionId, user.id, dto);
  }

  @ApiOperation({ summary: 'Create Comment' })
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
