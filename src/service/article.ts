/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-21 18:04:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\article.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ArticleSummary } from 'src/models/summary';
import { ArticleContent } from 'src/models/content';

@Injectable()
export default class ArticleService {
  constructor(
    @InjectModel(ArticleSummary.name) private readonly articleSummary: Model<ArticleSummary>,
    @InjectModel(ArticleContent.name) private readonly articleContent: Model<ArticleContent>,
  ) {}

  async findAll(): Promise<Res<Array<ArticleSummary>>> {
    const data = await this.articleSummary.find();
    return { success: true, code: 0, msg: '', data };
  }

  async findOneById(id: string): Promise<Res<any|ArticleContent>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const summary = await this.articleSummary.findById(id);
    const data = await this.articleContent.findOne({ title: summary.title });
    return { success: true, code: 0, msg: '查询成功', data };
  }

  async updateArticleById(article: ArticleSummary): Promise<any> {
    const data = await Promise.all([
      this.articleSummary.updateOne({ _id: article._id }, article),
      this.articleContent.updateOne({ title: article.title }, article),
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
    console.log(file);

    return { success: true, code: 0, msg: '', data: {} };
  }

  async deleteArticle(id: string): Promise<Res<any>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const data = await this.articleSummary.findByIdAndUpdate(id, { isDeleted: true, deleteTime: Date.now() });
    return { success: true, code: 0, msg: '', data };
  }

  async createArticle(article: ArticleSummary): Promise<any> {
    console.log(article);
    const data = await this.articleSummary.create(article);
    return { success: true, code: 0, msg: '', data };
  }
}
