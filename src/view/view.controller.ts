import { Controller, Get, Param, Render } from '@nestjs/common';
import * as MarkdownIt from 'markdown-it';
import { Base64 } from 'js-base64';
import { flatten, groupWith } from 'ramda';
import { BlogService } from 'src/blog/blog.service';

@Controller('view')
export class ViewController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/blog')
  @Render('index')
  async index() {
    const res = await this.blogService.findByPage(0);
    const articles = res.data?.articles.map(
      ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }) => ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }),
    );
    return {
      articles,
      totalPage: Math.ceil(res.data.total / 10),
      currentPage: 0,
      pageSize: 10,
      title: 'Mr.RS的个人博客-首页',
    };
  }

  @Get('/blog/keyword/:keyword')
  @Render('index')
  async keyword(@Param() { keyword }: { keyword: string }) {
    const res = await this.blogService.findByKeyword(keyword);
    const articles = res.data?.map(
      ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }) => ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }),
    );
    return { articles, title: 'Mr.RS的个人博客-关键字' };
  }

  @Get('/blog/about')
  @Render('detail')
  async about() {
    const res = await this.blogService.findOneById(359);
    const md = new MarkdownIt();
    const {
      title,
      author,
      author_id,
      category,
      create_time,
      description,
      tags,
      update_time,
      id,
      content,
    } = res?.data;
    const tmp = md.render(Base64.decode(content.toString()).split('---')[2]);
    console.log(tmp);

    const article = {
      title,
      author,
      author_id,
      category,
      create_time,
      description,
      tags,
      update_time,
      id,
      content: md.render(Base64.decode(content.toString()).split('---')[2]),
    };
    return { article, title: 'Mr.RS的个人博客-关于我' };
  }

  @Get('/blog/tags')
  @Render('tags')
  async tags() {
    const res = await this.blogService.findAll(0);
    const data: any = {};
    const tmp = flatten(res.data?.map(({ tags }) => tags.split(' ')));
    tmp
      ?.filter((item) => item !== '')
      .forEach((tag) => {
        data[tag] = data[tag] !== undefined ? data[tag] + 1 : 0;
      });

    return { data, title: 'Mr.RS的个人博客-标签' };
  }

  @Get('/blog/tags/:tag')
  @Render('index')
  async tagArticles(@Param() { tag }: { tag: string }) {
    const res = await this.blogService.findByTag(tag);
    const articles = res.data?.map(
      ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }) => ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }),
    );
    return { articles, title: `Mr.RS的个人博客-${tag}` };
  }

  @Get('/blog/category')
  @Render('category')
  async category() {
    const res = await this.blogService.findAll(0);
    const data: any = {};
    const tmp = flatten(res.data?.map(({ category }) => category.split(' ')));
    tmp
      ?.filter((item) => item !== '')
      .forEach((category) => {
        data[category] = data[category] !== undefined ? data[category] + 1 : 1;
      });

    return { data, title: 'Mr.RS的个人博客-分类' };
  }

  @Get('/blog/category/:category')
  @Render('index')
  async categoryArticles(@Param('category') category: string) {
    const res = await this.blogService.findByCategory(category);
    const articles = res.data?.map(
      ({
        title,
        author,
        author_id,
        create_time,
        description,
        tags,
        update_time,
        id,
      }) => ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }),
    );
    return { articles, title: `Mr.RS的个人博客-${category}` };
  }

  @Get('/blog/timeline')
  @Render('timeline')
  async timeline() {
    const res = await this.blogService.findTimeline(0);
    let years: Array<string> = [];
    const articles = res.data?.map(({ title, create_time, id }) => {
      const tmp = new Date(create_time).toLocaleString().split(' ')[0];
      const year = tmp.slice(0, 4);
      years.push(year);
      return {
        title,
        create_time: tmp,
        id,
        year,
      };
    });
    years = Array.from(new Set(years));
    const formatted = groupWith((a, b) => a.year === b.year, articles);
    formatted.forEach((item, index) => item.unshift({
      create_time: years[index],
      title: '',
      id: 0,
      year: '',
    }));

    return {
      articles: flatten(formatted),
      years,
      title: 'Mr.RS的个人博客-归档',
    };
  }

  @Get('/blog/timeline/:timeline')
  @Render('index')
  async timelineArticles(@Param() timeline: string) {
    const res = await this.blogService.findByTime(timeline);
    const articles = res.data?.map(
      ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }) => ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }),
    );
    return { articles, title: `Mr.RS的个人博客-归档${timeline}` };
  }

  @Get('/blog/error')
  @Render('error')
  async error() {
    return { title: 'Mr.RS的个人博客-出错了' };
  }

  @Get('/blog/:page/:size')
  @Render('index')
  async indexPage(@Param() { page, size }) {
    const res = await this.blogService.findByPage(0, +page, +size);
    const articles = res.data?.articles.map(
      ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }) => ({
        title,
        author,
        author_id,
        category,
        create_time,
        description,
        tags,
        update_time,
        id,
      }),
    );
    return {
      articles,
      totalPage: Math.ceil(res.data.total / size),
      currentPage: +page,
      pageSize: size,
      title: 'Mr.RS的个人博客-首页',
    };
  }

  @Get('/blog/:id')
  @Render('detail')
  async detail(@Param('id') articleId: number) {
    const res = await this.blogService.findOneById(articleId);
    const md = new MarkdownIt({ html: true });
    const {
      title,
      author,
      author_id,
      category,
      create_time,
      description,
      tags,
      id,
      update_time,
      content,
    } = res?.data;
    const _content = md
      .render(Base64.decode(content.toString()).split('---')[2])
      .replace(
        /<h2>(.+?)<\/h2>/g,
        `
      <h2>
        <span class='prefix'></span>
        <span class='content'>$1</span>
        <span class='suffix'></span>
      </h2>
    `,
      );
    const article = {
      title,
      author,
      author_id,
      category,
      create_time,
      description,
      tags,
      update_time,
      id,
      content: _content,
    };
    return { article, title: `Mr.RS的个人博客-${title}` };
  }
}
