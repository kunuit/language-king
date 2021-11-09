require('module-alias/register');
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(morgan('tiny'));
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Languages King Docs')
    .setDescription('The languages king API description')
    .setVersion('1.0')
    .addTag('LanguagesKing')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
