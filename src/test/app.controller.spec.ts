/*
* @Author: mrrs878
* @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-25 19:59:59
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: \blog_backend\src\app.controller.spec.ts
*/
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import ArticleModule from 'src/modules/article';
import AuthModule from 'src/modules/auth';
import { RedisCacheModule } from 'src/modules/cache';
import DB from 'src/modules/db';
import * as mongoose from 'mongoose';
import { RedisService } from 'nestjs-redis/dist';
import AuthController from '../controller/auth';
import AuthService from '../service/auth';

describe('AppController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.local', '.env'],
          isGlobal: true,
        }),
        RedisCacheModule,
        DB,
        AuthModule,
        ArticleModule,
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
    redisService = module.get<RedisService>(RedisService);
  });

  afterAll(async () => {
    mongoose.disconnect();
    redisService.getClient().disconnect();
  });

  describe('login', () => {
    it('should return a token', async () => {
      const result = ['test'];
      jest.spyOn<any, any>(authService, 'login').mockImplementation(() => result);
      expect(await authController.login({ name: 'test', password: 'test' })).toBe(result);
    });
  });
});
