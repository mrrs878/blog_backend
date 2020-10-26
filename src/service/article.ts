/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-10-23 17:09:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\article.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Article } from 'src/models/article';
import { Base64 } from 'js-base64';
import * as dayjs from 'dayjs';

@Injectable()
export default class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly article: Model<Article>,
  ) {}

  async findAll(): Promise<Res<Array<Article>>> {
    const data = await this.article.find(null, { content: 0 }).sort({ createTime: -1 });
    return { success: true, code: 0, msg: '获取成功', data };
  }

  async findByUser(req: any): Promise<Res<Array<Article>>> {
    const { name } = req.user;
    const filter = name === 'admin' ? {} : { author: name };

    const data = await this.article.aggregate([
      {
        $match: filter,
      },
      { $addFields: { s_article_id: { $toString: '$_id' } } },
      {
        $lookup: {
          from: 'comment',
          localField: 's_article_id',
          foreignField: 'article_id',
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'like',
          localField: 's_article_id',
          foreignField: 'articleId',
          as: 'likes',
        },
      },
      { $sort: { createTime: -1 } },
      {
        $project: {
          title: 1,
          categories: 1,
          author: 1,
          createTime: 1,
          updateTime: 1,
          tags: 1,
          comments: {
            content: 1,
            name: 1,
            createTime: 1,
          },
          likes: {
            name: 1,
            createTime: 1,
          },
        },
      },
    ]);

    return { success: true, code: 0, msg: '获取成功', data };
  }

  async findOneById(id: string): Promise<Res<any|Article>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const data = await this.article.findById(id);
    return { success: true, code: 0, msg: '查询成功', data };
  }

  async updateArticleById(article: Article, req: any): Promise<any> {
    const { name, _id } = req.user;
    const data = await this.article.updateOne({ _id: article._id }, {
      ...article,
      author: name,
      author_id: _id,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    if (data.ok && data.nModified === 1) return { success: true, code: 0, msg: '修改成功' };
    return { success: false, code: -1, msg: '修改失败' };
  }

  async deleteArticle(id: string): Promise<Res<any>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const data = await this.article.findByIdAndUpdate(id, { isDeleted: true, deleteTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    return { success: true, code: 0, msg: '', data };
  }

  async createArticle(req: any, article: Article): Promise<any> {
    const { name, _id } = req.user;
    const data = await this.article.create({
      ...article,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      author: name,
      author_id: _id,
    });
    return { success: true, code: 0, msg: '创建成功', data };
  }
}
