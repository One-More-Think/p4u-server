import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupDocument(app: INestApplication, path: string) {
  const docConfig = new DocumentBuilder()
    .setTitle('P4U API')
    .setDescription('P4U API description')
    .setVersion('1.1.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup(path, app, document);
}
