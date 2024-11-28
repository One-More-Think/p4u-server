import { registerAs } from '@nestjs/config';

export const JWT_KEY = {
  ACCESS_SECRET_KEY: 'jwt.access_secret_key',
  ACCESS_EXPIRATION_TIME: 'jwt.access_expiration_time',
  REFRESH_SECRET_KEY: 'jwt.refresh_secret_key',
  REFRESH_EXPIRATION_TIME: 'jwt.refresh_expiration_time',
} as const;
export default registerAs('jwt', () => ({
  access_secret_key: process.env.JWT_ACCESS_TOKEN_SECRET,
  access_expiration_time: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  refresh_secret_key: process.env.JWT_REFRESH_TOKEN_SECRET,
  refresh_expiration_time: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
}));
