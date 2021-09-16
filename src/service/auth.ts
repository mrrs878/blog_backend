/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-09-23 17:38:45
 * @LastEditTime: 2021-09-16 21:11:26
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 */
import { Injectable } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { getPuzzleImg } from '@mrrs878/sliding-puzzle/dist/index.cjs';
import { Menu } from 'src/models/menu';
import * as dayjs from 'dayjs';
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

  async getUserInfo(req: any) {
    const { name, role } = req.user;
    const data = await this.userModel.findOne({ name, role }, { salt: 0, passwordHash: 0, _v: 0 });
    return {
      success: true,
      code: 0,
      return_message: '',
      data,
    };
  }

  async validateUser(body: LoginBodyI) {
    const { name, password } = body;
    const user = await this.userModel.findOne({ name });
    if (!user) {
      return {
        code: -1,
        return_message: '用户不存在',
      };
    }

    const { passwordHash, salt } = user;
    const hashPassword = encryptPwd(password, salt);
    if (passwordHash === hashPassword) {
      return {
        code: 0,
        return_message: '',
        user,
      };
    }
    return {
      code: -2,
      return_message: '密码错误',
    };
  }

  async certificate(user: User) {
    try {
      const { name, role, _id } = user;
      const token = this.jwtService.sign({ name, role, _id });
      await this.cacheService.set(name, token);
      return token;
    } catch (e) {
      console.log(e);
    }
  }

  async reg(body: RegBodyI): Promise<Res<UserI|undefined>> {
    const { name, password, repassword, createdBy, role } = body;
    if (password !== repassword) {
      return {
        success: false,
        return_code: -1,
        return_message: '两次输入的密码不一样',
      };
    }

    const user = await this.userModel.findOne({ name });
    if (user) {
      return {
        success: false,
        return_code: -2,
        return_message: '用户名已存在',
      };
    }

    const salt = makeSalt();
    const passwordHash = encryptPwd(password, salt);
    if (!passwordHash) {
      return {
        success: false,
        return_code: -3,
        return_message: '服务器内部错误',
      };
    }
    try {
      const defaultVal = {
        department: '', address: '', tags: [], avatar: '', teams: [], profession: '', signature: '', status: 0,
      };
      await this.userModel.create({
        name, passwordHash, salt, role, createdBy, ...defaultVal, createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
      return {
        success: true,
        return_code: 0,
        return_message: '注册成功',
      };
    } catch {
      return {
        success: false,
        return_code: -3,
        return_message: '服务器内部错误',
      };
    }
  }

  async login(body: LoginBodyI): Promise<Res<undefined|{ name: string, role: number, _id: string, token: string }>> {
    try {
      const { code, return_message, user } = await this.validateUser(body);
      if (code !== 0) {
        return {
          return_code: code,
          success: false,
          return_message,
        };
      }

      const token = await this.certificate(user);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { _id, role, name } = user;
      return {
        success: true,
        return_code: 0,
        return_message: '登录成功',
        data: { _id, role, name, token },
      };
    } catch (e) {
      return {
        success: false,
        return_code: -1,
        return_message: e.message,
      };
    }
  }

  async autoLogin(req: any): Promise<Res<undefined|{ name: string, role: number, _id: string, token: string }>> {
    const { authorization } = req.headers;

    const [, token] = authorization.match(/^Bearer (.+)/) || [];
    const tokenInfo = this.jwtService.decode(token) as any;
    if (!tokenInfo) {
      return {
        success: false,
        return_code: -1,
        return_message: '登录信息失效',
      };
    }
    const { name, role } = tokenInfo;
    const user = await this.userModel.findOne({ name });
    const newToken = await this.certificate(user);
    const { _id } = user;
    return {
      success: true,
      return_code: 0,
      return_message: '登录成功',
      data: { _id, role, name, token: newToken },
    };
  }

  async logout(req: any): Promise<Res<undefined>> {
    const { user } = req;
    const { name } = user;
    await this.cacheService.set(name, '');
    return {
      success: true,
      return_code: 0,
      return_message: '退出登录成功',
    };
  }

  async getMenu(req: any): Promise<Res<Array<MenuItemI>>> {
    const res = await this.menuModel.find();
    const { user } = req;
    const { role } = user;
    const data = res.filter((item) => item.role?.includes(role));
    return {
      success: true,
      return_code: 0,
      return_message: '',
      data,
    };
  }

  async addMenu(body: any): Promise<Res<MenuItemI|undefined>> {
    try {
      const data = await this.menuModel.create(body);
      return {
        success: true,
        return_code: 0,
        return_message: '添加成功',
        data,
      };
    } catch (e) {
      return {
        success: false,
        return_code: -1,
        return_message: e.message,
      };
    }
  }

  async updateMenu(body: UpdateMenuBodyI, _id: string): Promise<Res<MenuItemI|undefined>> {
    try {
      if (!isValidObjectId(_id)) {
        return { success: false, return_code: -1, return_message: 'id错误' };
      }
      const data = await this.menuModel.updateOne({ _id }, { ...body, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
      return {
        success: true,
        return_code: 0,
        return_message: '更新成功',
        data,
      };
    } catch (e) {
      return {
        success: false,
        return_code: -1,
        return_message: e.message,
      };
    }
  }

  async updateUserStatus(body: any): Promise<Res<any>> {
    const { userId, status } = body;
    const user = await this.userModel.findOne({ _id: userId });
    console.log(user);

    if (!user) {
      return {
        success: false,
        return_message: '用户不存在',
        return_code: -1,
      };
    }
    const data = await this.userModel.updateOne({ _id: body.userId }, { status, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    return {
      success: true,
      return_code: 0,
      return_message: '更新成功',
      data,
    };
  }

  async getPuzzleImg(): Promise<Res<{ background: string, block: string, session: string}|undefined>> {
    try {
      const data = await getPuzzleImg('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
      const session = `${new Date().getTime()}`;
      this.cacheService.set(session, data.positionX);
      return {
        success: true,
        return_message: '获取成功',
        return_code: 0,
        data: { background: data.background, block: data.block, session },
      };
    } catch (e) {
      return {
        success: false,
        return_message: e.toString(),
        return_code: -1,
      };
    }
  }

  async checkPuzzle(session: string, left: number): Promise<Res<any>> {
    try {
      const cacheLeft = parseInt(await this.cacheService.get(session) || '', 10);
      await this.cacheService.delete(session);
      const success = left > cacheLeft - 5 && left < cacheLeft + 5;
      return {
        success,
        return_message: success ? '验证成功' : '验证失败',
        return_code: success ? 0 : -1,
      };
    } catch (e) {
      return {
        success: false,
        return_message: e.toString(),
        return_code: -1,
      };
    }
  }
}
