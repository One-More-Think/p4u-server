import { Module } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { UsersModule } from 'users/users.module';
import { QuestionsModule } from 'questions/questions.module';
import { GlobalConfigModule } from 'config/global-config.module';
import { MysqlDatabaseModule } from 'database/mysql.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // config
    GlobalConfigModule,

    // database
    MysqlDatabaseModule,

    // services
    UsersModule,
    QuestionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
