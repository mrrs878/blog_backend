/*
 * @Author: your name
 * @Date: 2020-10-13 21:00:22
 * @LastEditTime: 2020-10-14 22:47:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\user.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user';
import * as dayjs from 'dayjs';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
  ) {}

  async findAll(): Promise<Res<Array<User>>> {
    const data = await this.user.find({}, { passwordHash: 0, salt: 0, _v: 0 });
    return {
      success: true,
      code: 0,
      msg: '获取成功',
      data,
    };
  }

  async update(body: User): Promise<Res<User>> {
    const data = await this.user.updateOne({ _id: body._id }, { ...body, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    if (data.nModified === 1) {
      return {
        success: true,
        code: 0,
        msg: '修改成功',
        data,
      };
    }
    return {
      success: false,
      code: -1,
      msg: '修改失败',
      data,
    };
  }
}
