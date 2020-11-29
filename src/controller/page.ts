/*
* @Author: your name
* @Date: 2020-11-20 14:43:57
 * @LastEditTime: 2020-11-30 22:21:06
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: \blog_backend\src\controller\page.ts
*/
import { Controller, Get, flatten, Param, Render } from '@nestjs/common';
import ArticleService from 'src/service/article';
import { Base64 } from 'js-base64';
import * as MarkdownIt from 'markdown-it';

@Controller('/view')
export default class PageController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/')
  @Render('index')
  async index() {
    const res = await this.articleService.findAll('1');
    const articles = res.data?.map(({ title, author, author_id, categories, createTime, description, tags, updateTime, _id }) => ({
      title, author, author_id, categories, createTime, description, tags, updateTime, _id,
    }));
    return { articles };
  }

  @Get('/keyword/:keyword')
  @Render('index')
  async keyword(@Param() { keyword }: { keyword: string }) {
    const res = await this.articleService.findByKeyword(keyword);
    const articles = res.data?.map(({ title, author, author_id, categories, createTime, description, tags, updateTime, _id }) => ({
      title, author, author_id, categories, createTime, description, tags, updateTime, _id,
    }));
    return { articles };
  }

  @Get('/about')
  @Render('detail')
  async about() {
    const res = await this.articleService.findOneById('5fc0a2137d2d746455984438');
    const md = new MarkdownIt();
    const { title, author, author_id, categories, createTime, description, tags, updateTime, _id, content } = res?.data;
    const article = {
      title,
      author,
      author_id,
      categories,
      createTime,
      description,
      tags,
      updateTime,
      _id,
      content: md.render(Base64.decode(content).split('---')[2]),
    };
    return { article };
  }

  @Get('/tags')
  @Render('tags')
  async tags() {
    const res = await this.articleService.findAll('1');
    const data: any = {};
    const tmp = flatten(res.data?.map(({ tags }) => tags.split(' ')));
    tmp?.filter((item) => item !== '').forEach((tag) => {
      data[tag] = data[tag] !== undefined ? data[tag] + 1 : 0;
    });

    return { data };
  }

  @Get('/category')
  @Render('category')
  async category() {
    const res = await this.articleService.findAll('1');
    const data: any = {};
    const tmp = flatten(res.data?.map(({ categories }) => categories.split(' ')));
    tmp?.filter((item) => item !== '').forEach((category) => {
      data[category] = data[category] !== undefined ? data[category] + 1 : 0;
    });

    return { data };
  }

  @Get('/category/:category')
  @Render('index')
  async categoryArticles(@Param() { category }:{category: string}) {
    const res = await this.articleService.findByCategory(category);
    const articles = res.data?.map(({ title, author, author_id, categories, createTime, description, tags, updateTime, _id }) => ({
      title, author, author_id, categories, createTime, description, tags, updateTime, _id,
    }));
    return { articles };
  }

  @Get('/:id')
  @Render('detail')
  async detail(@Param() { id }:{id: string}) {
    const res = await this.articleService.findOneById(id);
    const md = new MarkdownIt();
    const { title, author, author_id, categories, createTime, description, tags, updateTime, _id, content } = res?.data;
    const article = {
      title,
      author,
      author_id,
      categories,
      createTime,
      description,
      tags,
      updateTime,
      _id,
      content: md.render(Base64.decode(content).split('---')[2]),
    };
    return { article };
  }
}
