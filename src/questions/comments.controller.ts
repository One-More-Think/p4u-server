import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { AccessTokenPayload } from 'auth/types';
import { User } from 'auth/user.decorator';
import { CommentsService } from './comments.service';
import { UpdateCommentReactionDto } from './dto/update-comment-reaction.dto';

@ApiTags('Comment')
@Controller({ path: 'comments' })
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'React to a comment' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':commentId/reactions')
  async reactToComment(
    @Param('commentId') commentId: number,
    @User() user: AccessTokenPayload,
    @Body() dto: UpdateCommentReactionDto,
  ) {
    await this.commentsService.reactToComment(
      commentId,
      user.id,
      dto.isLike,
      dto.isDislike,
    );
  }

  @ApiOperation({ summary: 'React to a comment' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':commentId/report')
  async reportToComment(
    @Param('commentId') commentId: number,
    @User() user: AccessTokenPayload,
  ) {
    await this.commentsService.reportToComment(commentId, user.id);
  }
}
