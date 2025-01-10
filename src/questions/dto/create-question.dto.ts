import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY } from 'questions/entities/question.entity';

export class CreateQuestionDto {
  @ApiProperty({
    name: 'title',
    description: 'Title of the question',
    example: 'How to create a question?',
  })
  title: string;

  @ApiProperty({
    name: 'description',
    description: 'Description of the question',
    example: 'I want to create a question.',
  })
  description: string;

  @ApiProperty({
    name: 'language',
    description: 'Language of the question',
    example: 'en',
  })
  language: string;

  @ApiProperty({
    name: 'timeout',
    description: 'Timeout of the question',
    example: '300/1800/3600/86400',
  })
  timeout: number;

  @ApiProperty({
    name: 'category',
    description: 'Category of the question',
    example: CATEGORY.LIVING,
    required: true,
  })
  category: CATEGORY;

  @ApiProperty({
    name: 'options',
    description:
      'Options of the question, minimum 1 option and maximum 3 options',
    example: ['Option 1', 'Option 2'],
  })
  options: string[];
}
