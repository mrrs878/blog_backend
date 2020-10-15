/*
 * @Author: your name
 * @Date: 2020-10-15 11:08:34
 * @LastEditTime: 2020-10-15 17:07:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\like.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { DocumentStatus } from 'src/constant';
import { Like } from 'src/models/like';
import * as dayjs from 'dayjs';
import { getNow } from 'src/tool';

@Injectable()
export default class LikeService {
  constructor(
    @InjectModel(Like.name) private readonly like: Model<Like>,
  ) {}

  async findByUser(req: any): Promise<Res<Array<Like>>> {
    const { name } = req.user;
    const data = await this.like.find({ name });
    return {
      success: true,
      code: 0,
      msg: '获取成功',
      data,
    };
  }

  async findByArticle(articleId: string): Promise<Res<Array<Like>>> {
    if (!isValidObjectId(articleId)) {
      return {
        success: false,
        code: -1,
        msg: 'id有误',
      };
    }
    const data = await this.like.find({ articleId, status: DocumentStatus.running });
    return {
      success: true,
      code: 0,
      msg: '获取成功',
      data,
    };
  }

  async addLike(body: { articleId: string }, req: any): Promise<Res<any>> {
    const { name } = req.user;
    const { articleId } = body;
    const tmp = await this.like.findOneAndUpdate({ name, articleId }, { status: DocumentStatus.running, updateTime: getNow() });
    if (tmp) {
      return {
        success: true,
        msg: '点赞成功',
        code: 0,
        data: tmp,
      };
    }
    const createTime = getNow();
    const like = { articleId, name, status: DocumentStatus.running, createTime, updateTime: createTime };
    const data = await this.like.create(like);
    return {
      success: true,
      msg: '点赞成功',
      code: 0,
      data,
    };
  }

  async unLike(articleId: string, req: any): Promise<Res<any>> {
    const { name } = req.user;
    const data = await this.like.update({ articleId, name }, { status: DocumentStatus.deleted, updateTime: getNow() });
    return {
      success: true,
      msg: '取消点赞成功',
      code: 0,
      data,
    };
  }
}