import { Controller, Get, Param, Put, Body, Post, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { GetArticleRes, GetArticlesSummaryRes, UpdateArticleRes, DeleteArticle } from 'src/swagger/res';
import { UploadArticleDto, UpdateArticleDto } from 'src/swagger/dto';
import ArticleService from '../service/article';

@Controller('/article')
@ApiTags('文章模块')
export default class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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
  getArticle(@Param() params) {
    return this.articleService.findOneById(params.id);
  }

  @Put('/:id')
  @ApiOperation({ description: '更新文章', summary: '更新文章' })
  @ApiParam({ name: 'id', description: '文章id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiBody({
    description: '文章',
    type: UpdateArticleDto,
  })
  @ApiOkResponse({ status: 200, type: UpdateArticleRes })
  updateArticle(@Param() params, @Body() body) {
    return this.articleService.updateArticleById({ ...body, _id: params.id });
  }

  @Post('/')
  @ApiOperation({ description: '上传文章', summary: '上传文章' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '文章',
    type: UploadArticleDto,
  })
  @ApiOkResponse({ status: 200, type: UpdateArticleRes })
  @UseInterceptors(FileInterceptor('article'))
  uploadFile(@UploadedFile() file) {
    return this.articleService.uploadArticle(file);
  }

  @Delete('/:id')
  @ApiOperation({ description: '删除文章', summary: '删除文章' })
  @ApiParam({ name: 'id', description: '文章id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: DeleteArticle })
  deleteArticle(@Param() params) {
    return this.articleService.deleteArticle(params.id);
  }
}