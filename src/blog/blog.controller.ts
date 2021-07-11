/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-09 17:23:50
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 16:40:37
 * @FilePath: \blog_backend\src\blog\blog.controller.ts
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Article } from './article.entity';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly articleService: BlogService) {}

  @Get('/article/:enabled')
  @ApiOperation({
    description: '获取站点所有文章',
    summary: '获取站点所有文章',
  })
  getAllArticles(@Param('enabled') enabled: number) {
    return this.articleService.findAll(enabled);
  }

  @Get('/keyword/:keyword')
  @ApiOperation({
    description: '通过关键字查询文章',
    summary: '通过关键字查询文章',
  })
  getArticleByKeyword(@Param() { keyword }: { keyword: string }) {
    return this.articleService.findByKeyword(keyword);
  }

  @Delete('/article/:id')
  @ApiOperation({ description: '删除文章', summary: '删除文章' })
  deleteArticle(@Param('id') id: number) {
    return this.articleService.deleteArticle(id);
  }

  @Put('/article')
  @ApiOperation({ description: '更新文章', summary: '更新文章' })
  updateArticle(@Body() body, @Req() req) {
    return this.articleService.updateArticleById(body, req);
  }

  @Post('/article')
  @ApiOperation({ description: '创建文章', summary: '创建文章' })
  createArticle(@Body() body: Article, @Req() req) {
    return this.articleService.createArticle(req, body);
  }
}
