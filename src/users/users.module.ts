import { Module } from '@nestjs/common';
import { UsersController } from 'users/users.controller';
import { UsersService } from 'users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { User } from 'entity/user.entity';
import { RedisService } from 'redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  controllers: [UsersController],
  providers: [UsersService, RedisService, ConfigService],
})
export class UsersModule {}
