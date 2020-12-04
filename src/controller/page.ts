/*
* @Author: your name
* @Date: 2020-11-20 14:43:57
 * @LastEditTime: 2020-12-04 17:34:50
 * @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: \blog_backend\src\controller\page.ts
*/
import { Controller, Get, Param, Render } from '@nestjs/common';
import ArticleService from 'src/service/article';
import { Base64 } from 'js-base64';
import { flatten, groupWith } from 'ramda';
import * as MarkdownIt from 'markdown-it';
import * as CaptureWebsite from 'capture-website';

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

  @Get('/timeline')
  @Render('timeline')
  async timeline() {
    const res = await this.articleService.findAll('1');
    let years: Array<string> = [];
    const articles = res.data?.map(({ title, createTime, _id }) => {
      const tmp = createTime.split(' ')[0];
      const year = tmp.slice(0, 4);
      years.push(year);
      return ({
        title, createTime: tmp, _id, year,
      });
    });
    years = Array.from(new Set(years));
    const formatted = groupWith((a, b) => a.year === b.year, articles);
    formatted.forEach((item, index) => item.unshift({ createTime: years[index], title: '', _id: 'year', year: '' }));

    return { articles: flatten(formatted), years: Array.from(new Set(years)) };
  }

  @Get('/timeline/:timeline')
  @Render('index')
  async timelineArticles(@Param() { timeline }:{timeline: string}) {
    const res = await this.articleService.findByTime(timeline);
    const articles = res.data?.map(({ title, author, author_id, categories, createTime, description, tags, updateTime, _id }) => ({
      title, author, author_id, categories, createTime, description, tags, updateTime, _id,
    }));
    return { articles };
  }

  @Get('/test')
  @Render('test')
  async test() {
    const url = await CaptureWebsite.base64('http://www.gmmsj.com');
    return { url };
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
