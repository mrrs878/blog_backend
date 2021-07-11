/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 22:14:55
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 22:16:27
 * @FilePath: \blog_backend\src\menu\menu.entity.ts
 */
import { BaseEntity } from 'src/common/models/Base.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column({ nullable: false })
  icon_name?: string;

  @Column()
  title: string;

  @Column({ default: '', nullable: false })
  path?: string;

  @Column({ nullable: false, default: [] })
  sub_menu?: Array<string>;

  @Column()
  parent: string;

  @Column({ nullable: false })
  role?: Array<number>;

  @Column({ nullable: false })
  position: number;
}
