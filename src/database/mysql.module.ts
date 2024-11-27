import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('mysql.host'),
        port: configService.get('mysql.port'),
        database: configService.get('mysql.database'),
        username: configService.get('mysql.user'),
        password: configService.get('mysql.password'),
        timezone: '+09:00',
        entities: ['dist/src/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: configService.get('mysql.sync'),
        migrations: ['dist/src/database/migration/*.js'], // ? dist
        cli: { migrationsDir: 'src/database/migration' },
        logging: configService.get('mysql.log'),
        bigNumberStrings: false,
        cache: true,
        legacySpatialSupport: false, // when use mysql, not mariadb
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MysqlDatabaseModule {}
