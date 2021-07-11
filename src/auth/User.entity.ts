/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 21:59:51
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 22:11:27
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

  @Column()
  avatar: string;

  @Column()
  created_by: number;

  @Column()
  signature: string;

  @Column()
  department: string;

  @Column()
  address: string;

  @Column()
  profession: string;

  @Column()
  tags: Array<string>;

  @Column()
  teams: Array<string>;

  @Column({ default: 2 })
  role: number;
}
