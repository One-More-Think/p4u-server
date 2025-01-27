import { ApiProperty } from '@nestjs/swagger';
import { CATEGORY } from 'questions/entities/question.entity';

export class UpdateQuestionDto {
  @ApiProperty({
    name: 'title',
    description: 'Title of the question',
    example: 'bla bla bla',
  })
  title: string;

  @ApiProperty({
    name: 'description',
    description: 'Description of the question',
    example: 'bla bla bla',
  })
  description: string;

  @ApiProperty({
    name: 'category',
    description: 'Category of the question',
    example: 0,
  })
  category: CATEGORY;

  @ApiProperty({
    name: 'options',
    description: 'Options to add',
    example: ['Option x'],
  })
  options: string[];
}
