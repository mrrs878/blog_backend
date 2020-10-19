/*
 * @Author: your name
 * @Date: 2020-10-15 11:08:34
 * @LastEditTime: 2020-10-19 13:14:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\like.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { DocumentStatus } from 'src/constant';
import { Like } from 'src/models/like';
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
    const data = await this.like.find({ article_id: articleId, status: DocumentStatus.running });
    return {
      success: true,
      code: 0,
      msg: '获取成功',
      data,
    };
  }

  async addLike(body: { article_id: string }, req: any): Promise<Res<any>> {
    const { name } = req.user;
    const { article_id } = body;
    const tmp = await this.like.findOneAndUpdate({ name, article_id }, { status: DocumentStatus.running, updateTime: getNow() });
    if (tmp) {
      return {
        success: true,
        msg: '点赞成功',
        code: 0,
        data: tmp,
      };
    }
    const createTime = getNow();
    const like = { article_id, name, status: DocumentStatus.running, createTime, updateTime: createTime };
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
    const data = await this.like.update({ article_id: articleId, name }, { status: DocumentStatus.deleted, updateTime: getNow() });
    return {
      success: true,
      msg: '取消点赞成功',
      code: 0,
      data,
    };
  }
}
