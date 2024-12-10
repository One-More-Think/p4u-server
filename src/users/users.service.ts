import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { SignInAppleDto, SignInGoogleDto, UpdateUserDto } from './dto/user.dto';
import axios from 'axios';
import { AuthService } from 'auth/auth.service';
import appleSigninAuth from 'apple-signin-auth';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

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
}
