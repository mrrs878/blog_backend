/*
* @Author: your name
* @Date: 2020-11-20 14:43:57
 * @LastEditTime: 2020-11-27 16:55:37
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: \blog_backend\src\controller\page.ts
*/
import { Controller, Get, Param, Render } from '@nestjs/common';
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
  tags() {
    const md = new MarkdownIt();
    const content = md.render('');
    return { article: { content } };
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
