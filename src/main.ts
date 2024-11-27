import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';

export const initApp = (app: INestApplication): INestApplication => {
  // cors
  app.enableCors();

  return app;
};

const bootstrap = async () => {
  let app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  console.log('ENVIRONMENT:', process.env.ENVIRONMENT);

  app = initApp(app);

  // TODO: setup docs

  await app.listen(configService.get('app.port'));
};
bootstrap();
