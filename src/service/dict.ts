/*
 * @Author: mrrs878
 * @Date: 2020-09-29 14:48:46
 * @LastEditTime: 2020-09-30 12:01:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\service\article.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Dict } from 'src/models/dict';
import * as dayjs from 'dayjs';

@Injectable()
export default class DictService {
  constructor(
    @InjectModel(Dict.name) private readonly article: Model<Dict>,
  ) {}

  async findAll(): Promise<Res<Array<Dict>>> {
    const data = await this.article.find().sort({ type: -1 });
    return { success: true, code: 0, msg: '', data };
  }

  async findOneById(id: string): Promise<Res<any|Dict>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const data = await this.article.findById(id);
    return { success: true, code: 0, msg: '查询成功', data };
  }

  async updateDictById(article: Dict): Promise<any> {
    const data = await this.article.updateOne({ _id: article._id }, { ...article, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    if (data.ok && data.nModified === 1) return { success: true, code: 0, msg: '修改成功' };
    return { success: false, code: -1, msg: '修改失败' };
  }

  async deleteDict(id: string): Promise<Res<any>> {
    if (!isValidObjectId(id)) {
      return { success: false, code: -1, msg: 'id错误', data: {} };
    }
    const data = await this.article.findByIdAndUpdate(id, { isDeleted: true, deleteTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    return { success: true, code: 0, msg: '', data };
  }

  async createDict(article: Dict): Promise<any> {
    const data = await this.article.create({
      ...article,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    return { success: true, code: 0, msg: '创建成功', data };
  }
}
