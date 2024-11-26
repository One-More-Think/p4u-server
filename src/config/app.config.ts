import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.ENVIRONMENT,
  port: +process.env.PORT || 3000,
}));
