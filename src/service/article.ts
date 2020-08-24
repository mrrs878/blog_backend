import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from 'src/models/article';

@Injectable()
export default class ArticleService {
  constructor(@InjectModel(Article.name) private readonly userModel: Model<Article>) {}

  async findAll(): Promise<Res<Array<Article>>> {
    const data = await this.userModel.find().exec();
    return { success: true, code: 0, msg: '', data };
  }

  async findOneById(id: string): Promise<Res<Article>> {
    const data = await this.userModel.findById(id).exec();
    return { success: true, code: 0, msg: '', data };
  }

  async updateArticleById(article: Article): Promise<any> {
    const data = await this.userModel.updateOne({ _id: article._id }, article).exec();
    console.log(data);
    
    const { ok, nModified } = data;
    if (ok && nModified === 1) return { success: true, code: 0, msg: '' };
    return { success: false, code: 1, msg: '修改失败' };
  }
}
