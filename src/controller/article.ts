/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-11-27 16:59:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\controller\article.ts
 */
import { Controller, Get, Param, Put, Body, Post, UseInterceptors, Delete, UsePipes, UseGuards, CacheInterceptor, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { GetArticleRes, GetArticlesSummaryRes, UpdateArticleRes, DeleteArticle } from 'src/swagger/res';
import { UpdateArticleDto, CreateArticleDto } from 'src/swagger/dto';
import { addArticleV } from 'src/pipes/JoiValidationPipe';
import { Article } from 'src/models/article';
import { AuthGuard } from '@nestjs/passport';
import MAIN_CONFIG from 'src/config';
import { RBACGuard } from 'src/guards/auth';
import ArticleService from '../service/article';

@Controller('/article')
@ApiTags('文章模块')
export default class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/all/:enabled')
  @ApiOperation({ description: '获取所有文章', summary: '获取所有文章' })
  @ApiOkResponse({ status: 200, type: GetArticlesSummaryRes })
  getAllArticles(@Param() params: { enabled: string }) {
    return this.articleService.findAll(params.enabled);
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Get('/user/:enabled')
  @ApiOperation({ description: '获取所有文章', summary: '获取所有文章' })
  @ApiOkResponse({ status: 200, type: GetArticlesSummaryRes })
  getArticlesByUser(@Req() req, @Param() params: { enabled: string }) {
    return this.articleService.findByUser(req, params.enabled);
  }

  @Get('/:id')
  @ApiOperation({ description: '查询单个文章', summary: '查询单个文章' })
  @ApiParam({ name: 'id', description: '文章id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: GetArticleRes })
  getArticle(@Param() params: { id: string }) {
    return this.articleService.findOneById(params.id);
  }

  @Get('/keyword/:keyword')
  @ApiOperation({ description: '通过关键字查询文章', summary: '通过关键字查询文章' })
  @ApiParam({ name: 'id', description: '关键字', example: 'react', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: GetArticleRes })
  getArticleByKeyword(@Param() { keyword }: { keyword: string }) {
    return this.articleService.findByKeyword(keyword);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Put('/')
  @ApiOperation({ description: '更新文章', summary: '更新文章' })
  @ApiParam({ name: 'id', description: '文章id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiBody({ description: '文章', type: UpdateArticleDto })
  @ApiOkResponse({ status: 200, type: UpdateArticleRes })
  updateArticle(@Body() body, @Req() req) {
    return this.articleService.updateArticleById(body, req);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  @ApiOperation({ description: '创建文章', summary: '创建文章' })
  @ApiBody({ description: '文章', type: CreateArticleDto })
  @ApiOkResponse({ status: 200, type: CreateArticleDto })
  @UsePipes(addArticleV)
  createArticle(@Body() body:Article, @Req() req) {
    return this.articleService.createArticle(req, body);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @ApiOperation({ description: '删除文章', summary: '删除文章' })
  @ApiParam({ name: 'id', description: '文章id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: DeleteArticle })
  deleteArticle(@Param() params) {
    return this.articleService.deleteArticle(params.id);
  }
}
