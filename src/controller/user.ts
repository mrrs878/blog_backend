/*
 * @Author: your name
 * @Date: 2020-10-13 16:36:04
 * @LastEditTime: 2020-10-13 16:46:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\controller\user.ts
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import UserService from 'src/service/user';
import { GetUsersRes } from 'src/swagger/res';

@Controller('/user')
@ApiTags('用户模块')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ description: '获取所有用户', summary: '获取所有用户' })
  @ApiOkResponse({ status: 200, type: GetUsersRes })
  getAllArticles() {
    return this.userService.findAll();
  }
}
