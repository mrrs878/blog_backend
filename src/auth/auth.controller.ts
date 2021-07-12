/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 23:45:49
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-12 16:10:54
 * @FilePath: \blog_backend\src\auth\auth.controller.ts
 */
import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ description: '登录', summary: '权限管理' })
  login(@Body() body: LoginBodyI) {
    return this.authService.login(body);
  }

  @Get('/autoLogin')
  @ApiOperation({ description: '自动登录', summary: '权限管理' })
  autoLogin(@Req() req) {
    return this.authService.autoLogin(req);
  }

  @Post('/logout')
  @ApiOperation({ description: '退出登录', summary: '权限管理' })
  logout(@Req() req) {
    return this.authService.logout(req);
  }

  @Post('/reg')
  @ApiOperation({ description: '注册', summary: '权限管理' })
  reg(@Body() body: RegBodyI) {
    return this.authService.reg(body);
  }

  @Get('/menu')
  @ApiOperation({ description: '获取菜单目录', summary: '权限管理' })
  getMenus(@Req() request) {
    return this.authService.getMenu(request);
  }

  @Get('/info')
  @ApiOperation({ description: '获取用户信息', summary: '权限管理' })
  getUserInfo(@Req() request) {
    return this.authService.getUserInfo(request);
  }

  @Post('/menu')
  @ApiOperation({ description: '添加菜单', summary: '权限管理' })
  addMenu(@Body() body: AddMenuBodyI) {
    return this.authService.addMenu(body);
  }

  @Put('/menu/:id')
  @ApiOperation({ description: '更新菜单', summary: '权限管理' })
  @ApiParam({
    name: 'id',
    description: '菜单项id',
    example: '5f50bf09e29bc4b4e723dbf5',
    allowEmptyValue: false,
    type: String,
  })
  updateMenu(@Body() body, @Param('id') id: number) {
    return this.authService.updateMenu(body, id);
  }

  @Put('/user')
  updateUserStatus(@Body() body) {
    return this.authService.updateUserStatus(body);
  }

  @Get('/puzzleImg')
  getPuzzleImg() {
    return this.authService.getPuzzleImg();
  }

  @Get('/verifyPuzzle/:session/:left')
  checkPuzzle(@Param('left') left: string, @Param('session') session: string) {
    return this.authService.checkPuzzle(session, parseInt(left, 10));
  }
}
