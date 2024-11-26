import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_MYSQL_HOST,
  port: +process.env.DB_MYSQL_PORT || 3306,
  database: process.env.DB_MYSQL_DATABASE,
  username: process.env.DB_MYSQL_USER,
  password: process.env.DB_MYSQL_PASSWORD,
  synchronize: false,
  // autoLoadEntities: true,
  timezone: '+09:00',
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['dist/src/database/migration/*.js'],
  logging: true,
  cache: true,
});

export default AppDataSource;
