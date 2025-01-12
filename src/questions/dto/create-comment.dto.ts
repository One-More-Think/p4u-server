import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    name: 'context',
    description: 'Content of the comment',
    example: 'This is a comment',
  })
  context: string;
}
