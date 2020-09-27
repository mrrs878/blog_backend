/*
 * @Author: mrrs878
 * @Date: 2020-09-23 17:38:30
 * @LastEditTime: 2020-09-27 16:40:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\controller\auth.ts
 */
import { Controller, Post, Body, UsePipes, Req, UseGuards, Get, Param, Request, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { AuthGuard } from '@nestjs/passport';
import { RBACGuard } from 'src/guards/auth';
import { addMenuV, JoiValidationPipe, updateMenuV } from '../pipes/JoiValidationPipe';
import { AddMenuDto, LoginDto, RegDto, UpdateMenuDto } from '../swagger/dto';
import { AddMenuRes, GetMenusRes, LoginRes, RegRes, UpdateMenuRes } from '../swagger/res';
import MAIN_CONFIG from '../config';
import AuthService from '../service/auth';

@Controller('/auth')
@ApiTags('登录模块')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @ApiOperation({ description: '登录', summary: '权限管理' })
  @ApiBody({ description: '登录', type: LoginDto })
  @ApiOkResponse({ status: 200, type: LoginRes })
  @UsePipes(new JoiValidationPipe(Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
  })))
  login(@Body() body: LoginBodyI) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  @ApiOperation({ description: '退出登录', summary: '权限管理' })
  @ApiOkResponse({ status: 200 })
  logout(@Req() req: Request) {
    return this.authService.logout(req);
  }

  @Post('/reg')
  @ApiOperation({ description: '注册', summary: '权限管理' })
  @ApiBody({ description: '注册', type: RegDto })
  @ApiOkResponse({ status: 200, type: RegRes })
  @UsePipes(new JoiValidationPipe(Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    repassword: Joi.string().required(),
    role: Joi.number().default(MAIN_CONFIG.ROLE.HUMAN),
  })))
  reg(@Body() body: RegBodyI) {
    return this.authService.reg(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/menu')
  @ApiOperation({ description: '获取菜单目录', summary: '权限管理' })
  @ApiOkResponse({ status: 200, type: GetMenusRes })
  getMenus(@Request() request) {
    return this.authService.getMenu(request);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.SUPER_ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Post('/menu')
  @ApiOperation({ description: '添加菜单', summary: '权限管理' })
  @ApiBody({ description: '添加菜单', type: AddMenuDto })
  @ApiOkResponse({ status: 200, type: AddMenuRes })
  @UsePipes(addMenuV)
  addMenu(@Body() body: AddMenuBodyI) {
    return this.authService.addMenu(body);
  }

  @UseGuards(new RBACGuard(MAIN_CONFIG.ROLE.SUPER_ADMIN))
  @UseGuards(AuthGuard('jwt'))
  @Put('/menu/:id')
  @ApiOperation({ description: '更新菜单', summary: '权限管理' })
  @ApiBody({ description: '更新菜单', type: UpdateMenuDto })
  @ApiParam({ name: 'id', description: '菜单项id', example: '5f50bf09e29bc4b4e723dbf5', allowEmptyValue: false, type: String })
  @ApiOkResponse({ status: 200, type: UpdateMenuRes })
  updateMenu(@Body(updateMenuV) body: UpdateMenuBodyI, @Param() params: { id: string }) {
    return this.authService.updateMenu(body, params.id);
  }
}
