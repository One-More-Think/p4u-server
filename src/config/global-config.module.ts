import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import mysqlConfig from './mysql.config';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'], // env file name
      load: [
        // import config files
        appConfig,
        mysqlConfig,
        jwtConfig,
      ],
    }),
  ],
})
export class GlobalConfigModule {}
