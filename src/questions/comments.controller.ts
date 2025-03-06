import {
  Body,
  Controller,
  Param,
  Put,
  Delete,
  UseGuards,
  Get,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { AccessTokenPayload } from 'auth/types';
import { User } from 'auth/user.decorator';
import { CommentsService } from './comments.service';
import { UpdateCommentReactionDto } from './dto/update-comment-reaction.dto';
import { CommentWriterValid } from 'auth/comment.decorator';

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
  @Post(':commentId/report')
  async reportToComment(
    @Param('commentId') commentId: number,
    @User() reporter: AccessTokenPayload,
  ) {
    await this.commentsService.reportToComment(commentId, reporter.id);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CommentWriterValid)
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: number) {
    await this.commentsService.deleteComment(commentId);
  }
}
