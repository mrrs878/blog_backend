/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-10-09 18:46:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\modules\db.ts
 */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URL'),
        useNewUrlParser: true,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export default class DB {
}
