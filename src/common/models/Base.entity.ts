/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-09 17:57:27
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 17:36:18
 * @FilePath: \blog_backend\src\common\models\Base.entity.ts
 */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @Column({ default: 0 })
  status: number;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  @DeleteDateColumn()
  delete_time: Date;
}
