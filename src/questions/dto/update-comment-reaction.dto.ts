import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentReactionDto {
  @ApiProperty()
  isLike: boolean;

  @ApiProperty()
  isDislike: boolean;
}
