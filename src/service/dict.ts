/*
 * @Author: mrrs878
 * @Date: 2020-09-29 14:48:46
 * @LastEditTime: 2021-05-21 18:58:55
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
    const data = await this.article.aggregate([
      { $addFields: { o_creator_id: { $toObjectId: '$creator_id' } } },
      { $addFields: { o_updater_id: { $toObjectId: '$updater_id' } } },
      {
        $lookup: {
          from: 'user',
          localField: 'o_creator_id',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'o_updater_id',
          foreignField: '_id',
          as: 'updater',
        },
      },
      { $unwind: '$creator' },
      { $unwind: '$updater' },
      { $sort: { createTime: -1 } },
      {
        $project: {
          name: 1,
          name_view: 1,
          value: 1,
          type: 1,
          type_view: 1,
          label: 1,
          label_view: 1,
          status: 1,
          createTime: 1,
          updateTime: 1,
          creator: {
            name: 1,
          },
          updater: {
            name: 1,
          },
        },
      },
    ]);
    return { success: true, return_code: 0, return_message: '', data };
  }

  async findOneById(id: string): Promise<Res<any|Dict>> {
    if (!isValidObjectId(id)) {
      return { success: false, return_code: -1, return_message: 'id错误', data: {} };
    }
    const data = await this.article.findById(id);
    return { success: true, return_code: 0, return_message: '查询成功', data };
  }

  async updateDictById(article: Dict, req: any): Promise<any> {
    const { _id } = req.user;
    const data = await this.article.updateOne({ _id: article._id }, { ...article, updater_id: _id, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    if (data.ok && data.nModified === 1) return { success: true, code: 0, msg: '修改成功' };
    return { success: false, code: -1, msg: '修改失败' };
  }

  async deleteDict(id: string, req: any): Promise<Res<any>> {
    if (!isValidObjectId(id)) {
      return { success: false, return_code: -1, return_message: 'id错误', data: {} };
    }
    const { _id } = req.user;
    const data = await this.article.findByIdAndUpdate(id, { isDeleted: true, updater_id: _id, deleteTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
    return { success: true, return_code: 0, return_message: '', data };
  }

  async createDict(article: Dict, req: any): Promise<any> {
    const { _id } = req.user;
    const data = await this.article.create({
      ...article,
      creator_id: _id,
      updater_id: _id,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    return { success: true, code: 0, msg: '创建成功', data };
  }
}
