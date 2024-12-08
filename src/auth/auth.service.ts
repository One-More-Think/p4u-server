import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { generatePayload } from './rules';
import { AccessTokenPayload } from './types';
import { JWT_KEY } from 'config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signIn(user: User) {
    const payload = generatePayload(user);
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(user.id);
    const userInfo = {
      id: user.id,
      email: user.email,
      age: user.age,
      gender: user.gender,
      aboutMe: user.aboutMe,
      country: user.country,
      occupation: user.occupation,
    };
    return {
      userInfo,
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(payload: AccessTokenPayload) {
    // console.log(this.configService)
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get(JWT_KEY.ACCESS_SECRET_KEY),
      expiresIn: this.configService.get(JWT_KEY.ACCESS_EXPIRATION_TIME),
    });
  }

  async generateRefreshToken(userId: number) {
    // TODO refresh token & ttl setting
    console.log('userId => ', userId);
    return 'This is refresh token';
  }

  async refreshAccessToken() {}

  async revokeRefreshToken() {}
}
