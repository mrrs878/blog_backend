import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
  ) {}

  async findAll(): Promise<Res<Array<User>>> {
    const data = await this.user.find({}, { passwordHash: 0, salt: 0 });
    return {
      success: true,
      code: 0,
      msg: '获取成功',
      data,
    };
  }
}
