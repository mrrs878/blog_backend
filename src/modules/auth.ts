/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-24 17:15:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\modules\auth.ts
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import MAIN_CONFIG from 'src/config';
import { JWTStrategy } from 'src/tool/jwt';
import UserController from '../controller/auth';
import UserService from '../service/auth';
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
  controllers: [UserController],
  providers: [UserService, JWTStrategy],
})
export default class AuthModule {}
