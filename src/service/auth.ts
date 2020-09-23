import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { makeSalt, encryptPwd } from 'src/tool';
import { User } from '../models/user';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<Res<Array<User>>> {
    const data = await this.userModel.find().exec();
    return { success: true, code: 0, msg: '', data };
  }

  async reg(body: RegBodyI): Promise<Res<UserI|undefined>> {
    const { name, password, repassword } = body;
    if (password !== repassword) {
      return {
        success: false,
        code: -1,
        msg: '两次输入的密码不一样',
      };
    }

    const user = await this.userModel.findOne({ name });
    if (user) {
      return {
        success: false,
        code: -2,
        msg: '用户名已存在',
      };
    }

    const salt = makeSalt();
    const passwordHash = encryptPwd(password, salt);
    if (!passwordHash) {
      return {
        success: false,
        code: -3,
        msg: '服务器内部错误',
      };
    }
    try {
      await this.userModel.create({ name, passwordHash, salt });
      return {
        success: true,
        code: 0,
        msg: '注册成功',
      };
    } catch {
      return {
        success: false,
        code: -3,
        msg: '服务器内部错误',
      };
    }
  }

  async validateUser(body: LoginBodyI) {
    const { name, password } = body;
    const user = await this.userModel.findOne({ name });
    if (!user) {
      return {
        code: -1,
        msg: '用户不存在',
      };
    }

    const { passwordHash, salt } = user;
    const hashPassword = encryptPwd(password, salt);
    if (passwordHash === hashPassword) {
      return {
        code: 0,
        msg: '',
      };
    }
    return {
      code: -2,
      msg: '密码错误',
    };
  }

  certificate(user: LoginBodyI) {
    try {
      const token = this.jwtService.sign(user);
      return token;
    } catch (e) {
      console.log(e);
    }
  }

  async login(body: LoginBodyI): Promise<Res<undefined|{ token: string }>> {
    try {
      const { code, msg } = await this.validateUser(body);
      if (code !== 0) {
        return {
          code,
          success: false,
          msg,
        };
      }

      const token = this.certificate(body);
      return {
        success: true,
        code: 0,
        msg: '登录成功',
        data: { token },
      };
    } catch (e) {
      return {
        success: false,
        code: -1,
        msg: e.message,
      };
    }
  }
}
