import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import {
  SignInAdminDto,
  SignInAppleDto,
  SignInGoogleDto,
  UpdateUserDto,
} from './dto/user.dto';
import axios from 'axios';
import { AuthService } from 'auth/auth.service';
import appleSigninAuth from 'apple-signin-auth';
import { CommentReaction } from './entities/comment-reaction.entity';
import { Comment } from 'questions/entities/comment.entity';
import { Question } from 'questions/entities/question.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
    private dataSource: DataSource,
  ) {}

  async signInAdmin(dto: SignInAdminDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: dto.id, snsId: dto.password },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return await this.authService.signIn(user);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async signInGoogle(dto: SignInGoogleDto) {
    try {
      const result = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${dto.idToken}`,
      );
      const { email, sub: snsId } = result.data;

      // local test
      // const email = 'minho.lee0716@gmail.com';
      // const snsId = 'asdfwfsadf5s8sadfas56d';
      const originUser = await this.usersRepository.findOne({
        where: { snsType: 'google', snsId, email },
      });
      if (originUser) {
        if (originUser.isBanned) {
          throw new ForbiddenException('Banned user');
        }
        return await this.authService.signIn(originUser);
      }

      if (!originUser) {
        // create user
        const newUser = User.create(snsId, 'google', email);
        await this.usersRepository.save(newUser);
        const user = await this.usersRepository.findOne({
          where: { snsType: 'google', snsId, email },
        });
        return await this.authService.signIn(user);
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async signInApple(dto: SignInAppleDto) {
    try {
      const { sub, email } = await appleSigninAuth.verifyIdToken(dto.idToken);
      const originUser = await this.usersRepository.findOne({
        where: { snsType: 'apple', snsId: sub, email },
      });
      if (originUser) {
        if (originUser.isBanned) {
          throw new ForbiddenException('Banned user');
        }
        return await this.authService.signIn(originUser);
      }

      if (!originUser) {
        // create user
        const newUser = User.create(sub, 'apple', email);
        await this.usersRepository.save(newUser);
        const user = await this.usersRepository.findOne({
          where: { snsType: 'apple', snsId: sub, email },
        });
        return await this.authService.signIn(user);
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async updateUser(userId: number, dto: UpdateUserDto) {
    try {
      let user = await this.usersRepository.findOne({ where: { id: userId } });
      user = { ...user, ...dto };
      await this.usersRepository.update(userId, user);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async getUserDetail(userId: number) {
    try {
      return await this.usersRepository
        .createQueryBuilder('user')
        .where({ id: userId })
        .select([
          'user.gender',
          'user.age',
          'user.email',
          'user.country',
          'user.occupation',
          'user.aboutMe',
          'writtenComments',
          'writtenQuestions',
          'commentedQuestions',
          'commentedQuestionsWriter',
          'writtenQuestionsWriter',
        ])
        .leftJoin('user.writtenComments', 'writtenComments')
        .leftJoin('user.writtenQuestions', 'writtenQuestions')
        .leftJoin('writtenComments.question', 'commentedQuestions')
        .leftJoin('commentedQuestions.writer', 'commentedQuestionsWriter')
        .leftJoin('writtenQuestions.writer', 'writtenQuestionsWriter')
        .getOne()
        .then((result) => {
          let commentedQuestions = [];
          let writtenQuestions = [];

          if (result && result.writtenComments.length) {
            commentedQuestions = result.writtenComments
              .map((comment) => comment.question)
              .filter(
                (item, index, self) =>
                  index === self.findIndex((obj) => obj.id === item.id),
              )
              .map((question) => {
                const writer = {
                  id: question.writer.id,
                  country: question.writer.country,
                  gender: question.writer.gender,
                  age: question.writer.age,
                  occupation: question.writer.occupation,
                };
                return {
                  id: question.id,
                  language: question.language,
                  title: question.title,
                  writer,
                };
              });
          }

          if (result && result.writtenQuestions.length) {
            writtenQuestions = result.writtenQuestions.map((question) => {
              const writer = {
                id: question.writer.id,
                country: question.writer.country,
                gender: question.writer.gender,
                age: question.writer.age,
                occupation: question.writer.occupation,
              };
              return {
                id: question.id,
                language: question.language,
                title: question.title,
                writer,
              };
            });
          }
          delete result.writtenComments;

          return { ...result, commentedQuestions, writtenQuestions };
        });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async deleteUser(userId: number) {
    try {
      // start transaction
      await this.dataSource.transaction(async (manager) => {
        const user = await manager.findOne(User, {
          where: { id: userId },
          relations: [
            'writtenQuestions',
            'writtenComments',
            'selectedOptions',
            'commentReactions',
          ],
          select: {
            id: true,
            writtenQuestions: { id: true },
            writtenComments: { id: true },
            selectedOptions: { id: true },
            commentReactions: { id: true },
          },
          loadEagerRelations: false,
        });

        // delete comment reactions
        user.commentReactions.forEach(async (commentReaction) => {
          await manager.delete(CommentReaction, { id: commentReaction.id });
        });

        // delete comment
        user.writtenComments.forEach(async (comment) => {
          await manager.delete(Comment, { id: comment.id });
        });

        // delete question
        user.writtenQuestions.forEach(async (question) => {
          await manager.delete(Question, { id: question.id });
        });

        // delete user
        await manager.delete(User, { id: userId });
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}
