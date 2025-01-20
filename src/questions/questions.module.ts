import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from 'questions/questions.controller';
import { QuestionsService } from 'questions/questions.service';
import { Question } from './entities/question.entity';
import { Comment } from './entities/comment.entity';
import { Option } from './entities/option.entity';
import { UserOption } from 'users/entities/user-option.entity';
import { UserOptionsController } from './user-options.controller';
import { UserOptionsService } from './user-options.service';
import { UsersModule } from 'users/users.module';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Comment, Option, UserOption]),
    UsersModule,
  ],
  controllers: [QuestionsController, UserOptionsController, CommentsController],
  providers: [QuestionsService, UserOptionsService, CommentsService],
})
export class QuestionsModule { }
