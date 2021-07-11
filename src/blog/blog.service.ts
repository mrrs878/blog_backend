import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { clone } from 'ramda';
import * as dayjs from 'dayjs';
import { Article } from './article.entity';

function formatTime<T = Array<Article> | Article>(articles: T): T {
  const src = clone(Array.isArray(articles) ? articles : [articles]);
  const res = src.map((item) => ({
    ...item,
    create_time: dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
    update_time: item.update_time
      ? dayjs(item.update_time).format('YYYY-MM-DD HH:mm:ss')
      : item.update_time,
    delete_time: item.delete_time
      ? dayjs(item.delete_time).format('YYYY-MM-DD HH:mm:ss')
      : item.delete_time,
  }));
  return Array.isArray(articles) ? res : res[0];
}

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Article)
    private readonly article: Repository<Article>,
  ) {}

  async findAll(status: number): Promise<Res<Array<Article>>> {
    try {
      const data = await this.article.find({
        where: { status },
        order: { update_time: 'DESC' },
      });
      return {
        return_code: 0,
        return_message: '获取成功',
        data: formatTime(data),
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.toString(),
        data: [],
      };
    }
  }

  async findTimeline(status: number): Promise<Res<Array<Article>>> {
    try {
      const data = await this.article.find({
        where: { status },
        order: { create_time: 'DESC' },
      });
      return {
        return_code: 0,
        return_message: '获取成功',
        data: formatTime(data),
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.toString(),
        data: [],
      };
    }
  }

  async findByPage(
    status: number,
    page = 0,
    size = 10,
  ): Promise<Res<{ articles: Array<Article>; total: number }>> {
    try {
      const [articles, total] = await this.article.findAndCount({
        where: { status },
        skip: page * size,
        take: size,
        order: { update_time: 'DESC' },
      });
      return {
        return_code: 0,
        return_message: '获取成功',
        data: {
          articles: formatTime(articles),
          total,
        },
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.toString(),
        data: { articles: [], total: 0 },
      };
    }
  }

  async findOneById(
    id: number,
  ): Promise<Res<Record<string, unknown> | Article>> {
    try {
      const data = await this.article.findOne(Number(id));
      return {
        return_code: 0,
        return_message: '查询成功',
        data: formatTime(data),
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.toString(),
        data: {},
      };
    }
  }

  async findByTime(time: string): Promise<Res<Array<Article>>> {
    try {
      const create_time = new RegExp(`${time}-`, 'i');
      const data = await this.article.find({ create_time: `%${create_time}` });
      return {
        return_code: 0,
        return_message: '查询成功',
        data,
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.toString(),
        data: [],
      };
    }
  }

  async findByKeyword(keywords: string): Promise<Res<Array<Article>>> {
    try {
      const title = new RegExp(keywords, 'i');
      const data = await this.article.find({ where: { title } });
      return {
        return_code: 0,
        return_message: '查询成功',
        data,
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.toString(),
        data: [],
      };
    }
  }

  async findByCategory(category: string): Promise<Res<Array<Article>>> {
    try {
      const data = await this.article.find({
        where: { category },
        order: { update_time: -1 },
      });
      return {
        return_code: 0,
        return_message: '查询成功',
        data,
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.toString(),
        data: [],
      };
    }
  }

  async findByTag(tags: string): Promise<Res<Array<Article>>> {
    try {
      const data = await this.article.find({ where: { tags } });
      return {
        return_code: 0,
        return_message: '查询成功',
        data,
      };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.toString(),
        data: [],
      };
    }
  }

  async updateArticleById(article: any, req: any): Promise<Res<undefined>> {
    try {
      const { name, id } = req.user;
      const data = await this.article.update(
        { id: article.id },
        {
          ...article,
          author: name,
          author_id: id,
        },
      );
      if (data.affected === 1) return { return_code: 0, return_message: '修改成功' };
      return { return_code: -1, return_message: '修改失败' };
    } catch (e) {
      return { return_code: -1, return_message: '修改失败' };
    }
  }

  async deleteArticle(id: number): Promise<Res<any>> {
    try {
      const data = await this.article.softDelete(id);
      return { return_code: 0, return_message: '', data };
    } catch (e) {
      return {
        return_code: -1,
        return_message: e.toString(),
        data: {},
      };
    }
  }

  async createArticle(req: any, article: Article) {
    try {
      const { name, id } = { name: 'tom', id: 1 };
      const data = await this.article.save({
        ...article,
        author: name,
        author_id: id,
      });
      return { code: 0, return_message: '创建成功', data };
    } catch (e) {
      return {
        code: -1,
        return_message: e.toString(),
        data: {},
      };
    }
  }
}
