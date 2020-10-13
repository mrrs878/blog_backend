/*
 * @Author: mrrs878
 * @Date: 2020-10-13 14:48:46
 * @LastEditTime: 2020-10-13 16:40:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\modules\user.ts
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user';
import UserController from 'src/controller/user';
import UserService from 'src/service/user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export default class UserModule {}
