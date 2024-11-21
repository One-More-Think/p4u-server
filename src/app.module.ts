import { Module } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { UsersModule } from 'users/users.module';
import { QuestionsModule } from 'questions/questions.module';
import { RedisService } from 'redis/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { User } from 'entity/user.entity';
import { Question } from 'entity/question.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DB_ADDRESSS}`,
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      port: parseInt(`${process.env.DB_PORT}`),
      database: `${process.env.DB_DATABASE}`,
      entities: [User, Question],
      synchronize: true,
    }),
    UsersModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
