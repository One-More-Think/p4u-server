import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { SignInGoogleDto } from './dto/user.dto';
import axios from 'axios';
import { AuthService } from 'auth/auth.service';

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
      console.log('Result => ', result.data); // check google api response
      const { email, sub: snsId } = result.data;
      // const email = 'minho.lee0716@gmail.com'; // test
      // const snsId = 'asd65f4a76sd5fasasd456asd5f45'; // test

      const originUser = await this.usersRepository.findOne({
        where: { snsType: 'google', snsId, email },
      });
      if (originUser) {
        if (originUser.isBanned) {
          throw new ForbiddenException('Banned user');
        }
        console.log('Already user, sign in');
        return await this.authService.signIn(originUser);
      }

      if (!originUser) {
        // create user
        const newUser = User.create(snsId, 'google', email, dto.country);
        await this.usersRepository.save(newUser);
        const user = await this.usersRepository.findOne({
          where: { snsType: 'google', snsId, email },
        });
        console.log('New user, sign in');
        return await this.authService.signIn(user);
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async signInApple() {}
}
