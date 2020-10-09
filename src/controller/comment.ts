/*
 * @Author: your name
 * @Date: 2020-10-09 09:57:52
 * @LastEditTime: 2020-10-09 11:42:34
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\controller\comment.ts
 */
import { Controller, UseInterceptors, CacheInterceptor, Get, Param, UseGuards, Put, Body, Post, UsePipes, Delete, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import CommentService from 'src/service/comment';
import { RBACGuard } from 'src/guards/auth';
import MAIN_CONFIG from 'src/config';
import { Comment } from 'src/models/comment';
import { UpdateCommentDto, CreateCommentDto } from 'src/swagger/dto';
import { addCommentV } from 'src/pipes/JoiValidationPipe';
import { GetCommentsRes, GetCommentRes, UpdateCommentRes, DeleteCommentRes } from 'src/swagger/res';

@Controller('/comment')
@ApiTags('评论模块')
export default class CommentController {
  constructor(private readonly articleService: CommentService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/article/:id')
  @ApiOperation({ description: '获取文章所有评论', summary: '获取文章所有评论' })
  @ApiParam({ name: 'id', description: '评论id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: GetCommentsRes })
  getArticleAllComments(@Param() params: { id: string }) {
    return this.articleService.findByArticleId(params.id);
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Get('/author')
  @ApiOperation({ description: '获取作者所有评论', summary: '获取作者所有评论' })
  @ApiOkResponse({ status: 200, type: GetCommentsRes })
  getAuthorAllComments(@Req() req) {
    return this.articleService.findByAuthor(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  @ApiOperation({ description: '查询单个评论', summary: '查询单个评论' })
  @ApiParam({ name: 'id', description: '评论id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: GetCommentRes })
  getComment(@Param() params: { id: string }) {
    return this.articleService.findOneById(params.id);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  @ApiOperation({ description: '更新评论', summary: '更新评论' })
  @ApiParam({ name: 'id', description: '评论id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiBody({ description: '评论', type: UpdateCommentDto })
  @ApiOkResponse({ status: 200, type: UpdateCommentRes })
  updateComment(@Param() params, @Body() body) {
    return this.articleService.updateCommentById({ ...body, _id: params.id });
  }

  // @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.HUMAN))
  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  @ApiOperation({ description: '创建评论', summary: '创建评论' })
  @ApiBody({ description: '评论', type: CreateCommentDto })
  @ApiOkResponse({ status: 200, type: CreateCommentDto })
  @UsePipes(addCommentV)
  createComment(@Body() body:Comment) {
    return this.articleService.createComment(body);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @ApiOperation({ description: '删除评论', summary: '删除评论' })
  @ApiParam({ name: 'id', description: '评论id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: DeleteCommentRes })
  deleteComment(@Param() params) {
    return this.articleService.deleteComment(params.id);
  }
}
