import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from 'questions/questions.controller';
import { QuestionsService } from 'questions/questions.service';
import { Question } from './entities/question.entity';
import { Comment } from './entities/comment.entity';
import { Option } from './entities/option.entity';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Comment, Option])],
  controllers: [QuestionsController],
  providers: [QuestionsService, CommentsService],
})
export class QuestionsModule {}
