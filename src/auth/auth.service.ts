import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCanvas, loadImage } from 'canvas';
import * as crypto from 'crypto';
import { CacheService } from 'src/cache/cache.service';
import { encryptPwd, makeSalt } from 'src/common/tool';
import { Menu } from 'src/menu/menu.entity';
import { Repository } from 'typeorm';
import { User } from './User.entity';

const l = 42; // 滑块边长
const r = 9; // 滑块半径
const w = 350; // canvas宽度
const h = 200; // canvas高度
const { PI } = Math;
const L = l + r * 2 + 3; // 滑块实际边长

const KEY = '1234123412ABCDEF'; // 十六位十六进制数作为密钥

const BLOCK_POSITION_FIX = [0, 15, 12];

function drawLine(
  ctx: CanvasRenderingContext2D | null,
  x: number,
  y: number,
  operation: 'fill' | 'clip',
  shape: number,
) {
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

interface ISignPayload {
  name: string;
  role: number;
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
    private readonly cacheService: CacheService,
  ) {}

  private static sign(payload: ISignPayload, key: string) {
    const res = crypto.publicEncrypt(key, Buffer.from(JSON.stringify(payload)));
    return res.toString();
  }

  private static decode(info: string, key: string) {
    return crypto.privateDecrypt(key, Buffer.from(info));
  }

  async getUserInfo(req: any) {
    const { name, role } = req.user;
    const data = await this.userRepo.find({
      where: { name, role },
    });
    return {
      code: 0,
      return_message: '',
      data,
    };
  }

  async validateUser(body: LoginBodyI) {
    const { name, password } = body;
    const user = await this.userRepo.findOne({ name });
    if (!user) {
      return {
        code: -1,
        return_message: '用户不存在',
      };
    }

    const { password_hash, salt } = user;
    const hashPassword = encryptPwd(password, salt);
    if (password_hash === hashPassword) {
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
      const { name, role, id } = user;
      const token = AuthService.sign({ name, role, id }, KEY);
      await this.cacheService.set(name, token);
      return token;
    } catch (e) {
      console.log(e);
    }
  }

  async reg(body: RegBodyI): Promise<Res<UserI | undefined>> {
    const { name, password, repassword, created_by, role } = body;
    if (password !== repassword) {
      return {
        return_code: -1,
        return_message: '两次输入的密码不一样',
      };
    }

    const user = await this.userRepo.findOne({ name });
    if (user) {
      return {
        return_code: -2,
        return_message: '用户名已存在',
      };
    }

    const salt = makeSalt();
    const password_hash = encryptPwd(password, salt);
    if (!password_hash) {
      return {
        return_code: -3,
        return_message: '服务器内部错误',
      };
    }
    try {
      const defaultVal = {
        department: '',
        address: '',
        tags: [],
        avatar: '',
        teams: [],
        profession: '',
        signature: '',
        status: 0,
      };
      await this.userRepo.create({
        name,
        password_hash,
        salt,
        role,
        created_by,
        ...defaultVal,
      });
      return {
        return_code: 0,
        return_message: '注册成功',
      };
    } catch {
      return {
        return_code: -3,
        return_message: '服务器内部错误',
      };
    }
  }

  async login(
    body: LoginBodyI,
  ): Promise<
    Res<undefined | { name: string; role: number; id: number; token: string }>
    > {
    try {
      const { code, return_message, user } = await this.validateUser(body);
      if (code !== 0) {
        return {
          return_code: code,
          return_message,
        };
      }

      const token = await this.certificate(user);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { id, role, name } = user;
      return {
        return_code: 0,
        return_message: '登录成功',
        data: { id, role, name, token },
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.message,
      };
    }
  }

  async autoLogin(
    req: any,
  ): Promise<
    Res<undefined | { name: string; role: number; id: number; token: string }>
    > {
    const { authorization } = req.headers;

    const [, token] = authorization.match(/^Bearer (.+)/) || [];
    const tokenInfo = AuthService.decode(token, KEY) as any;
    if (!tokenInfo) {
      return {
        return_code: -1,
        return_message: '登录信息失效',
      };
    }
    const { name, role } = tokenInfo;
    const user = await this.userRepo.findOne({ name });
    const newToken = await this.certificate(user);
    const { id } = user;
    return {
      return_code: 0,
      return_message: '登录成功',
      data: { id, role, name, token: newToken },
    };
  }

  async logout(req: any): Promise<Res<undefined>> {
    const { user } = req;
    const { name } = user;
    await this.cacheService.set(name, '');
    return {
      return_code: 0,
      return_message: '退出登录成功',
    };
  }

  async getMenu(req: any): Promise<Res<Array<MenuItemI>>> {
    const res = await this.menuRepo.find();
    const { user } = req;
    const { role } = user;
    const data = res.filter((item) => item.role?.includes(role));
    return {
      return_code: 0,
      return_message: '',
      data,
    };
  }

  async addMenu(body: any): Promise<Res<any>> {
    try {
      const data = await this.menuRepo.create(body);
      return {
        return_code: 0,
        return_message: '添加成功',
        data,
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.message,
      };
    }
  }

  async updateMenu(
    body: UpdateMenuBodyI,
    id: number,
  ): Promise<Res<MenuItemI | undefined>> {
    try {
      const data = await this.menuRepo.save({
        ...body,
        id,
      });
      return {
        return_code: 0,
        return_message: '更新成功',
        data,
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.message,
      };
    }
  }

  async updateUserStatus(body: any): Promise<Res<any>> {
    const { userId, status } = body;
    const user = await this.userRepo.findOne({ id: userId });
    console.log(user);

    if (!user) {
      return {
        return_message: '用户不存在',
        return_code: -1,
      };
    }
    const data = await this.userRepo.save({ status, id: body.userId });
    return {
      return_code: 0,
      return_message: '更新成功',
      data,
    };
  }

  async getPuzzleImg(): Promise<
  Res<
  { canvas: string; block: string; session: string; x: number } | undefined
  >
  > {
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
      const image = await loadImage(
        'http://gmm.sdoprofile.com/events/assets/img/home_bg.5849ea6.png',
      );
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
        return_message: '获取成功',
        return_code: 0,
        data: {
          canvas: imageCanvas.toDataURL(),
          block: blockCanvas.toDataURL(),
          session,
          x,
        },
      };
    } catch (e) {
      return {
        return_message: e.toString(),
        return_code: -1,
      };
    }
  }

  async checkPuzzle(session: string, left: number): Promise<Res<any>> {
    try {
      const cacheLeft = parseInt(
        (await this.cacheService.get(session)) || '',
        10,
      );
      console.log(cacheLeft);
      await this.cacheService.delete(session);
      const success = left > cacheLeft - 5 && left < cacheLeft + 5;
      return {
        return_message: success ? '验证成功111' : '验证失败',
        return_code: success ? 0 : -1,
      };
    } catch (e) {
      return {
        return_message: e.toString(),
        return_code: -1,
      };
    }
  }
}
