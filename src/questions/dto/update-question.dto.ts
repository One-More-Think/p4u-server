import { ApiProperty } from '@nestjs/swagger';

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
    name: 'options',
    description: 'Options to add',
    example: ['Option x'],
  })
  options: string[];
}
