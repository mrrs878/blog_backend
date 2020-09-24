/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-24 18:46:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\main.ts
 */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { HttpExceptionFilter } from 'src/filter/httpException';
import AppModule from './app.module';
import { AnyExceptionFilter } from './filter/anyException';
import { TransformInterceptor } from './interceptor/transform';
import { logger } from './middleware/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.enableCors();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logger);

  const options = new DocumentBuilder()
    .setTitle('blog')
    .setDescription('blog api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);

  app.useGlobalFilters(new AnyExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT);
}
bootstrap().then(() => {
  console.log(`app is running at ${process.env.PORT}`);
}).catch((e) => console.log(e));
