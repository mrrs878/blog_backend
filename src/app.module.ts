import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AuthModule from './modules/auth';
import ArticleModule from './modules/article';
import DB from './modules/db';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    DB,
    AuthModule,
    ArticleModule,
  ],
})
export default class AppModule {}
