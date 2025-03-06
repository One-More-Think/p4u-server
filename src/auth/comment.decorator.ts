import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'questions/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentWriterValid implements CanActivate {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const commentId = request.params.commentId;

    if (!commentId) {
      throw new ForbiddenException('Comment ID is required');
    }

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment ID ${commentId} not found.`);
    }

    if (comment.writerId !== user.id) {
      throw new ForbiddenException('You are not the writer of this comment.');
    }

    return true;
  }
}
