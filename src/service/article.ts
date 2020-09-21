/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-21 19:23:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\article.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Article } from 'src/models/article';
import { Base64 } from 'js-base64';

@Injectable()
export default class ArticleService {
  constructor(
    @InjectModel(Article.name) private readonly article: Model<Article>,
  ) {}

  async findAll(): Promise<Res<Array<Article>>> {
    const data = await this.article.find(null, { content: 0 });
    return { success: true, code: 0, msg: '', data };
  }

  async findOneById(id: string): Promise<Res<any|Article>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const data = await this.article.findById(id);
    return { success: true, code: 0, msg: '查询成功', data };
  }

  async updateArticleById(article: Article): Promise<any> {
    const data = await Promise.all([
      this.article.updateOne({ _id: article._id }, article),
      this.article.updateOne({ title: article.title }, article),
    ]);
    const [updateSummaryRes, updateContentRes] = data;
    if (updateSummaryRes.ok
      && updateSummaryRes.nModified === 1
      && updateContentRes.ok
      && updateContentRes.nModified === 1) return { success: true, code: 0, msg: '修改成功' };
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
    const data = await this.article.findByIdAndUpdate(id, { isDeleted: true, deleteTime: Date.now() });
    return { success: true, code: 0, msg: '', data };
  }

  async createArticle(article: Article): Promise<any> {
    const data = await this.article.create({ ...article, createTime: new Date().getTime().toString(), content: Base64.encode(article.content) });
    return { success: true, code: 0, msg: '创建成功', data };
  }
}
