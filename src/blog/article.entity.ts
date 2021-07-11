/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-09 17:53:53
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 18:20:21
 * @FilePath: \blog_backend\src\blog\article.entity.ts
 */
import { BaseEntity } from 'src/common/models/Base.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  tags: string;

  @Column({ unique: true })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  author: string;

  @Column()
  author_id: number;
}
