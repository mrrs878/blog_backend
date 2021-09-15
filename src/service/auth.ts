/*
 * @Author: mrrs878
 * @Date: 2020-09-23 17:38:45
 * @LastEditTime: 2021-09-15 20:28:12
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 */
import { Injectable } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Menu } from 'src/models/menu';
import { createCanvas, loadImage } from 'canvas';
import * as dayjs from 'dayjs';
import { encryptPwd, makeSalt } from '../tool';
import { User } from '../models/user';
import CacheService from './cache';

const l = 42; // 滑块边长
const r = 9; // 滑块半径
const w = 350; // canvas宽度
const h = 200; // canvas高度
const { PI } = Math;
const L = l + r * 2 + 3; // 滑块实际边长

const BLOCK_POSITION_FIX = [0, 15, 12];

function drawLine(ctx: CanvasRenderingContext2D|null, x: number, y: number, operation: 'fill'|'clip', shape: number) {
  if (!ctx) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
  if (shape === 0) {
    ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(x + l, y + l);
    ctx.lineTo(x, y + l);
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
    ctx.lineTo(x, y);
  } else if (shape === 1) {
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(x + l, y + l + 2);
    ctx.arc(x + l / 2, y + l + 8, r, -0.21 * PI, 1.21 * PI);
    ctx.lineTo(x, y + l + 2);
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  } else if (shape === 2) {
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + 5, y + l / 2, r, 1.31 * PI, 2.71 * PI);
    ctx.lineTo(x + l, y + l);
    ctx.arc(x + l / 2, y + l - 5, r, 0.21 * PI, 0.81 * PI, true);
    ctx.lineTo(x, y + l);
    ctx.lineTo(x, y);
  }
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.stroke();
  ctx[operation]();
  ctx.globalCompositeOperation = 'overlay';
}

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

  async getPuzzleImg(): Promise<Res<{ canvas: string, block: string, session: string, x: number }|undefined>> {
    try {
      const imageCanvas = createCanvas(w, h);
      const blockCanvas = createCanvas(w, h);
      const imageCanvasCtx = imageCanvas.getContext('2d');
      const blockCanvasCtx = blockCanvas.getContext('2d');

      const x = (Math.random() * 200 + 90) >> 0;
      const y = (Math.random() * 100 + 40) >> 0;

      const blockShapeTmp = (Math.random() * 100) % 3 >> 0;
      drawLine(imageCanvasCtx, x, y, 'fill', blockShapeTmp);
      drawLine(blockCanvasCtx, x, y, 'clip', blockShapeTmp);
      const image = await loadImage('https://mrrsblog.oss-cn-shanghai.aliyuncs.com/avatar.jpg');
      blockCanvasCtx?.drawImage(image, 0, 0, w, h);
      imageCanvasCtx?.drawImage(image, 0, 0, w, h);
      const newY = y - r * 2 - 1 + BLOCK_POSITION_FIX[blockShapeTmp];
      const imageData = blockCanvasCtx?.getImageData(x - 3, newY, L, L);
      if (imageData) {
        blockCanvas.width = L;
        blockCanvasCtx?.putImageData(imageData, 0, newY);
      }
      const session = `${new Date().getTime()}`;
      this.cacheService.set(session, x);
      return {
        success: true,
        return_message: '获取成功',
        return_code: 0,
        data: { canvas: imageCanvas.toDataURL(), block: blockCanvas.toDataURL(), session, x },
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
      console.log(cacheLeft);
      await this.cacheService.delete(session);
      const success = left > cacheLeft - 5 && left < cacheLeft + 5;
      return {
        success,
        return_message: success ? '验证成功111' : '验证失败',
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
