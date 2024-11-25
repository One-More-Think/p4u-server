import { Module } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { UsersModule } from 'users/users.module';
import { QuestionsModule } from 'questions/questions.module';
import { RedisService } from 'redis/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { User } from 'users/entities/user.entity';
import { Question } from 'questions/entities/question.entity';
import { Comment } from 'questions/entities/comment.entity';
import { Option } from 'questions/entities/option.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: __dirname + '/../src/.env',
    }),
    CacheModule.register({
      // store: redisStore,
      // url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_ADDRESSS,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 3306),
      database: process.env.DB_DATABASE,
      entities: [User, Question, Comment, Option],
      logging: true,
      synchronize: true, // on production false
    }),
    UsersModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
