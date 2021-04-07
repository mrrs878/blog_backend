/*
 * @Author: mrrs878
 * @Date: 2020-09-23 17:38:45
 * @LastEditTime: 2021-04-07 18:06:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\auth.ts
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
      msg: '',
      data,
    };
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
      const defaultVal = {
        department: '', address: '', tags: [], avatar: '', teams: [], profession: '', signature: '', status: 0,
      };
      await this.userModel.create({
        name, passwordHash, salt, role, createdBy, ...defaultVal, createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
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

  async login(body: LoginBodyI): Promise<Res<undefined|{ name: string, role: number, _id: string, token: string }>> {
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { _id, role, name } = user;
      return {
        success: true,
        code: 0,
        msg: '登录成功',
        data: { _id, role, name, token },
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

  async addMenu(body: any): Promise<Res<MenuItemI|undefined>> {
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
      const data = await this.menuModel.updateOne({ _id }, { ...body, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
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

  async updateUserStatus(body: any): Promise<Res<any>> {
    const { userId, status } = body;
    const user = await this.userModel.findOne({ _id: userId });
    console.log(user);

    if (!user) {
      return {
        success: false,
        msg: '用户不存在',
        code: -1,
      };
    }
    const data = await this.userModel.updateOne({ _id: body.userId }, { status, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    return {
      success: true,
      code: 0,
      msg: '更新成功',
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
      const image = await loadImage('http://gmm.sdoprofile.com/events/assets/img/home_bg.5849ea6.png');
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
        msg: '获取成功',
        code: 0,
        data: { canvas: imageCanvas.toDataURL(), block: blockCanvas.toDataURL(), session, x },
      };
    } catch (e) {
      return {
        success: false,
        msg: e.toString(),
        code: -1,
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
        msg: success ? '验证成功111' : '验证失败',
        code: success ? 0 : -1,
      };
    } catch (e) {
      return {
        success: false,
        msg: e.toString(),
        code: -1,
      };
    }
  }
}
