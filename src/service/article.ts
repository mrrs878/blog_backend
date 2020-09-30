/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-30 14:13:55
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

  async findOneById(id: string): Promise<Res<any|Article>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const data = await this.article.findById(id);
    return { success: true, code: 0, msg: '查询成功', data };
  }

  async updateArticleById(article: Article): Promise<any> {
    const data = await this.article.updateOne({ _id: article._id }, { ...article, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    if (data.ok && data.nModified === 1) return { success: true, code: 0, msg: '修改成功' };
    return { success: false, code: -1, msg: '修改失败' };
  }

  async uploadArticle(file: FileI): Promise<any> {
    if (!file) {
      return { success: true, code: -1, msg: '文件错误', data: {} };
    }
    console.log(JSON.parse(file.buffer.toString()).length);
    JSON.parse(file.buffer.toString()).forEach(async (item) => {
      await this.article.create({ ...item, content: Base64.encode(item.content) });
    });

    return { success: true, code: 0, msg: '', data: {} };
  }

  async deleteArticle(id: string): Promise<Res<any>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const data = await this.article.findByIdAndUpdate(id, { isDeleted: true, deleteTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    return { success: true, code: 0, msg: '', data };
  }

  async createArticle(article: Article): Promise<any> {
    const data = await this.article.create({
      ...article,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    return { success: true, code: 0, msg: '创建成功', data };
  }
}
