import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { setupDocument } from 'common/swagger';

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

  // swagger
  setupDocument(app, 'api');

  await app.listen(configService.get('app.port'));
};
bootstrap();
