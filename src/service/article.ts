/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2021-05-20 10:53:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\article.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Article } from 'src/models/article';
import * as dayjs from 'dayjs';
import { getNow } from 'src/tool';

@Injectable()
export default class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly article: Model<Article>,
  ) {}

  async findAll(status: string): Promise<Res<Array<Article>>> {
    try {
      const data = await this.article.find({ status: Number(status) }, { content: 0 }).sort({ createTime: -1 });
      return { success: true, code: 0, msg: '获取成功', data };
    } catch (e) {
      return { success: false, code: -1, msg: e.toString(), data: [] };
    }
  }

  async findByPage(status: string, page = 0, size = 10): Promise<Res<{ articles: Array<Article>, total: number }>> {
    try {
      const articles = await this.article.find({ status: Number(status) }, { content: 0 }).skip(page * size).limit(size).sort({ createTime: -1 });
      return { success: true, code: 0, msg: '获取成功', data: { articles, total: await this.article.count({}).exec() } };
    } catch (e) {
      return { success: false, code: -1, msg: e.toString(), data: { articles: [], total: 0 } };
    }
  }

  async findByUser(req: any, status: string): Promise<Res<Array<Article>>> {
    try {
      const { name } = req.user;
      let filter = {};
      filter = name === 'admin' ? filter : { ...filter, author: name };
      filter = status === '0' ? filter : { ...filter, status: 1 };

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
            _id: 1,
            title: 1,
            categories: 1,
            author: 1,
            createTime: 1,
            updateTime: 1,
            tags: 1,
            status: 1,
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
    } catch (e) {
      return { success: false, code: -1, msg: e.toString(), data: [] };
    }
  }

  async findOneById(id: string): Promise<Res<Record<string, unknown>|Article>> {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, code: -1, msg: 'id错误', data: {} };
      }
      const data = await this.article.findById(id);
      return { success: true, code: 0, msg: '查询成功', data };
    } catch (e) {
      return { success: false, code: -1, msg: e.toString(), data: {} };
    }
  }

  async findByKeyword(keywords: string): Promise<Res<Array<Article>>> {
    try {
      const title = new RegExp(keywords, 'i');
      const data = await this.article.find({ title });
      return { success: true, code: 0, msg: '查询成功', data };
    } catch (e) {
      return { success: false, code: -1, msg: e.toString(), data: [] };
    }
  }

  async findByCategory(categories: string): Promise<Res<Array<Article>>> {
    try {
      const data = await this.article.find({ categories });
      return { success: true, code: 0, msg: '查询成功', data };
    } catch (e) {
      return { success: false, code: -1, msg: e.toString(), data: [] };
    }
  }

  async findByTag(tags: string): Promise<Res<Array<Article>>> {
    try {
      const data = await this.article.find({ tags: { $regex: tags } });
      return { success: true, code: 0, msg: '查询成功', data };
    } catch (e) {
      return { success: false, code: -1, msg: e.toString(), data: [] };
    }
  }

  async findByTime(time: string): Promise<Res<Array<Article>>> {
    try {
      const createTime = new RegExp(`${time}-`, 'i');
      const data = await this.article.find({ createTime });
      return { success: true, code: 0, msg: '查询成功', data };
    } catch (e) {
      return { success: false, code: -1, msg: e.toString(), data: [] };
    }
  }

  async updateArticleById(article: any, req: any): Promise<Res<undefined>> {
    try {
      const { name, _id } = req.user;
      const data = await this.article.updateOne({ _id: article._id }, {
        ...article,
        author: name,
        author_id: _id,
        updateTime: getNow(),
      });
      if (data.ok && data.nModified === 1) return { success: true, code: 0, msg: '修改成功' };
      return { success: false, code: -1, msg: '修改失败' };
    } catch (e) {
      return { success: false, code: -1, msg: '修改失败' };
    }
  }

  async deleteArticle(id: string): Promise<Res<any>> {
    try {
      if (!isValidObjectId(id)) {
        return { success: false, code: -1, msg: 'id错误', data: {} };
      }
      const data = await this.article.findByIdAndUpdate(id, { isDeleted: true, deleteTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
      return { success: true, code: 0, msg: '', data };
    } catch (e) {
      return { success: false, code: -1, msg: e.toString(), data: {} };
    }
  }

  async createArticle(req: any, article: Article): Promise<any> {
    try {
      const { name, _id } = req.user;
      const data = await this.article.create({
        ...article,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        author: name,
        author_id: _id,
      });
      return { success: true, code: 0, msg: '创建成功', data };
    } catch (e) {
      return { success: false, code: -1, msg: e.toString(), data: {} };
    }
  }
}
