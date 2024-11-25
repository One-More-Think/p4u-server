import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from 'questions/questions.controller';
import { QuestionsService } from 'questions/questions.service';
import { Question } from 'questions/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
