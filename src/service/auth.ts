/*
 * @Author: mrrs878
 * @Date: 2020-09-23 17:38:45
 * @LastEditTime: 2020-09-30 14:14:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\auth.ts
 */
import { Injectable } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Menu } from 'src/models/menu';
import { encryptPwd, makeSalt } from '../tool';
import { User } from '../models/user';
import CacheService from './cache';

@Injectable()
export default class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Menu.name) private readonly menuModel: Model<Menu>,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
  ) {}

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
        user,
      };
    }
    return {
      code: -2,
      msg: '密码错误',
    };
  }

  async certificate(user: User) {
    try {
      const { name, role } = user;
      const token = this.jwtService.sign({ name, role });
      await this.cacheService.set(name, token);
      return token;
    } catch (e) {
      console.log(e);
    }
  }

  async reg(body: RegBodyI): Promise<Res<UserI|undefined>> {
    const { name, password, repassword, role } = body;
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
      await this.userModel.create({ name, passwordHash, salt, role });
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

  async login(body: LoginBodyI): Promise<Res<undefined|{ token: string }>> {
    try {
      const { code, msg, user } = await this.validateUser(body);
      if (code !== 0) {
        return {
          code,
          success: false,
          msg,
        };
      }

      const token = await this.certificate(user);
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

  async logout(req: any): Promise<Res<undefined>> {
    const { user } = req;
    const { name } = user;
    await this.cacheService.set(name, '');
    return {
      success: true,
      code: 0,
      msg: '退出登录成功',
    };
  }

  async getMenu(req: any): Promise<Res<Array<MenuItemI>>> {
    const res = await this.menuModel.find();
    const { user } = req;
    const { role } = user;
    const data = res.filter((item) => item.role?.includes(role));
    return {
      success: true,
      code: 0,
      msg: '',
      data,
    };
  }

  async addMenu(body: AddMenuBodyI): Promise<Res<MenuItemI|undefined>> {
    try {
      const data = await this.menuModel.create(body);
      return {
        success: true,
        code: 0,
        msg: '添加成功',
        data,
      };
    } catch (e) {
      return {
        success: false,
        code: -1,
        msg: e.message,
      };
    }
  }

  async updateMenu(body: UpdateMenuBodyI, _id: string): Promise<Res<MenuItemI|undefined>> {
    try {
      if (!isValidObjectId(_id)) {
        return { success: false, code: -1, msg: 'id错误' };
      }
      const data = await this.menuModel.updateOne({ _id }, body);
      return {
        success: true,
        code: 0,
        msg: '更新成功',
        data,
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
