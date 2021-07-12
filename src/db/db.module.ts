/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-09 17:26:21
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-12 16:20:45
 * @FilePath: \blog_backend\src\db\db.module.ts
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DBModule {}
