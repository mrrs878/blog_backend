/*
 * @Author: your name
 * @Date: 2020-10-13 16:36:04
 * @LastEditTime: 2020-10-14 22:52:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\controller\user.ts
 */
import { Controller, Get, UseGuards, Put, Body, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import UserService from 'src/service/user';
import { GetUsersRes } from 'src/swagger/res';
import { updateUserV } from 'src/pipes/JoiValidationPipe';

@Controller('/user')
@ApiTags('用户模块')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ description: '获取所有用户', summary: '获取所有用户' })
  @ApiOkResponse({ status: 200, type: GetUsersRes })
  getAllUsers() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/')
  @ApiOperation({ description: '更新用户', summary: '更新用户' })
  @UsePipes(updateUserV)
  updateUser(@Body() body) {
    return this.userService.update(body);
  }
}
