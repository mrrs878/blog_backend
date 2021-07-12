/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 21:59:51
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-12 16:25:21
 * @FilePath: \blog_backend\src\auth\User.entity.ts
 */
import { BaseEntity } from 'src/common/models/Base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password_hash: string;

  @Column()
  salt: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ default: 0 })
  created_by: number;

  @Column({ default: '' })
  signature: string;

  @Column({ default: '' })
  department: string;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  profession: string;

  @Column({ default: '' })
  tags: string;

  @Column({ default: '' })
  teams: string;

  @Column({ default: 2 })
  role: number;
}
