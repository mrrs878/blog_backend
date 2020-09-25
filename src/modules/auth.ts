/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-25 18:50:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\modules\auth.ts
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import MAIN_CONFIG from 'src/config';
import { JWTStrategy } from 'src/service/jwtStrategy';
import AuthService from 'src/service/auth';
import CacheService from 'src/service/cache';
import AuthController from 'src/controller/auth';
import { User, UserSchema } from '../models/user';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: MAIN_CONFIG.SECRET,
      signOptions: { expiresIn: '10min' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, CacheService],
})
export default class AuthModule {}
