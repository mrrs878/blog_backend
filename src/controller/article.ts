/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-28 10:11:27
 * @LastEditors: mrrs878
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\controller\article.ts
 */
import { Controller, Get, Param, Put, Body, Post, UploadedFile, UseInterceptors, Delete, UsePipes, UseGuards, CacheInterceptor } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { GetArticleRes, GetArticlesSummaryRes, UpdateArticleRes, DeleteArticle } from 'src/swagger/res';
import { UploadArticleDto, UpdateArticleDto, CreateArticleDto } from 'src/swagger/dto';
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
  @Get('/all')
  @ApiOperation({ description: '获取所有文章', summary: '获取所有文章' })
  @ApiOkResponse({ status: 200, type: GetArticlesSummaryRes })
  getAllArticles() {
    return this.articleService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ description: '查询单个文章', summary: '查询单个文章' })
  @ApiParam({ name: 'id', description: '文章id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: GetArticleRes })
  getArticle(@Param() params: { id: string }) {
    return this.articleService.findOneById(params.id);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  @ApiOperation({ description: '更新文章', summary: '更新文章' })
  @ApiParam({ name: 'id', description: '文章id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiBody({ description: '文章', type: UpdateArticleDto })
  @ApiOkResponse({ status: 200, type: UpdateArticleRes })
  updateArticle(@Param() params, @Body() body) {
    return this.articleService.updateArticleById({ ...body, _id: params.id });
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Post('/upload')
  @ApiOperation({ description: '上传文章', summary: '上传文章' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '文章', type: UploadArticleDto })
  @ApiOkResponse({ status: 200, type: UpdateArticleRes })
  @UseInterceptors(FileInterceptor('article'))
  uploadFile(@UploadedFile() file) {
    return this.articleService.uploadArticle(file);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  @ApiOperation({ description: '创建文章', summary: '创建文章' })
  @ApiBody({ description: '文章', type: CreateArticleDto })
  @ApiOkResponse({ status: 200, type: CreateArticleDto })
  @UsePipes(addArticleV)
  createArticle(@Body() body:Article) {
    return this.articleService.createArticle(body);
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
