/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-29 18:56:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\modules\dict.ts
 */
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DictController from 'src/controller/dict';
import DictService from '../service/dict';
import { Dict, DictSchema } from '../models/dict';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dict.name, schema: DictSchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [DictController],
  providers: [DictService],
})
export default class DictModule {}
