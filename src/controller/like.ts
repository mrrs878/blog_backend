/*
 * @Author: your name
 * @Date: 2020-10-15 11:10:28
 * @LastEditTime: 2020-10-15 16:34:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\controller\like.ts
 */
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { likeArticleV } from 'src/pipes/JoiValidationPipe';
import LikeService from 'src/service/like';

@Controller('/like')
@ApiTags('点赞模块')
export default class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  @ApiOperation({ description: '点赞', summary: '点赞' })
  @UsePipes(likeArticleV)
  like(@Body() body, @Req() req) {
    return this.likeService.addLike(body, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:articleId')
  @ApiOperation({ description: '取消点赞', summary: '取消点赞' })
  unLike(@Param() params, @Req() req) {
    return this.likeService.unLike(params.articleId, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  @ApiOperation({ description: '获取用户所有点赞', summary: '获取用户所有点赞' })
  getUserLikes(@Req() req) {
    return this.likeService.findByUser(req);
  }

  @Get('/:id')
  @ApiOperation({ description: '获取文章所有点赞', summary: '获取文章所有点赞' })
  getArticleLikes(@Param() params) {
    return this.likeService.findByArticle(params.id);
  }
}
