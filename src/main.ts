/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-09 16:43:04
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 15:46:09
 * @FilePath: \blog_backend\src\main.ts
 */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { AnyExceptionFilter } from './common/filters/anyException';
import { HttpExceptionFilter } from './common/filters/httpException';
import { logger } from './common/middleware/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = new DocumentBuilder()
    .setTitle('blog')
    .setDescription('blog api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('blog-doc', app, document);

  app.use(logger);
  app.useGlobalFilters(new AnyExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');

  await app.listen(process.env.PORT);
}
bootstrap()
  .then(() => {
    console.log(`app is running at ${process.env.PORT}`);
  })
  .catch((e) => console.log(e));
