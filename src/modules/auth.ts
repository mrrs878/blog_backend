/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-10-09 16:21:55
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
import { Menu, MenuSchema } from 'src/models/menu';
import { User, UserSchema } from '../models/user';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: MAIN_CONFIG.SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, CacheService],
})
export default class AuthModule {}
