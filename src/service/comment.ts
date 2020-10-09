/*
 * @Author: your name
 * @Date: 2020-10-09 09:57:52
 * @LastEditTime: 2020-10-09 19:50:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\comment.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Comment } from 'src/models/comment';
import * as dayjs from 'dayjs';
import { Article } from 'src/models/article';

@Injectable()
export default class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly comment: Model<Comment>,
    @InjectModel(Article.name) private readonly article: Model<Article>,
  ) {}

  async findAll(): Promise<Res<Array<Comment>>> {
    const data = await this.comment.find(null, { content: 0 }).sort({ createTime: -1 });
    return { success: true, code: 0, msg: '获取成功', data };
  }

  async findByArticleId(article_id: string): Promise<Res<Array<Comment>>> {
    const data = await this.comment.find({ article_id }).sort({ createTime: -1 });
    return { success: true, code: 0, msg: '获取成功', data };
  }

  async findByAuthor(req: any): Promise<Res<Array<any>>> {
    const { name } = req.user;

    const data = await this.article.aggregate([
      { $addFields: { article_id: { $toString: '$_id' } } },
      {
        $match: {
          author: name,
        },
      },
      {
        $lookup: {
          from: 'comment',
          localField: 'article_id',
          foreignField: 'article_id',
          as: 'comments',
        },
      },
      {
        $project: { content: 0 },
      },
    ]);

    return { success: true, code: 0, msg: '获取成功', data };
  }

  async findOneById(id: string): Promise<Res<any|Comment>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const data = await this.comment.findById(id);
    return { success: true, code: 0, msg: '查询成功', data };
  }

  async updateCommentById(comment: Comment): Promise<any> {
    const data = await this.comment.updateOne({ _id: comment._id }, { ...comment, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    if (data.ok && data.nModified === 1) return { success: true, code: 0, msg: '修改成功' };
    return { success: false, code: -1, msg: '修改失败' };
  }

  async deleteComment(id: string): Promise<Res<any>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const data = await this.comment.findByIdAndUpdate(id, { isDeleted: true, deleteTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    return { success: true, code: 0, msg: '', data };
  }

  async createComment(comment: Comment): Promise<any> {
    const data = await this.comment.create({
      ...comment,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    return { success: true, code: 0, msg: '发表成功', data };
  }
}
