/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-23 19:12:35
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\main.ts
 */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { HttpExceptionFilter } from 'src/filter/httpException';
import AppModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.enableCors();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const options = new DocumentBuilder()
    .setTitle('blog')
    .setDescription('blog api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT);
}
bootstrap().then(() => {
  console.log(`app is running at ${process.env.PORT}`);
}).catch((e) => console.log(e));
