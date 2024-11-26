import { Module } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { UsersModule } from 'users/users.module';
import { QuestionsModule } from 'questions/questions.module';
// import { RedisService } from 'redis/redis.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { CacheModule } from '@nestjs/cache-manager';
// import { User } from 'users/entities/user.entity';
// import { Question } from 'questions/entities/question.entity';
// import { Comment } from 'questions/entities/comment.entity';
// import { Option } from 'questions/entities/option.entity';
import { GlobalConfigModule } from 'config/global-config.module';
import { MysqlDatabaseModule } from 'database/mysql.module';

@Module({
  imports: [
    // config
    GlobalConfigModule,

    // database
    MysqlDatabaseModule,

    // services
    UsersModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
