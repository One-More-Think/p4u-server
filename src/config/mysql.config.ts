import { registerAs } from '@nestjs/config';

export default registerAs('mysql', () => ({
  host: process.env.DB_MYSQL_HOST,
  port: +process.env.DB_MYSQL_PORT || 3306,
  database: process.env.DB_MYSQL_DATABASE,
  user: process.env.DB_MYSQL_USER,
  password: process.env.DB_MYSQL_PASSWORD,
  sync: process.env.DB_MYSQL_SYNC === 'true',
  log: process.env.DB_MYSQL_LOG === 'true',
}));
