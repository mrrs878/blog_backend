/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-25 19:45:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\controller\auth.ts
 */
import { Controller, Post, Body, UsePipes, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JoiValidationPipe } from '../pipes';
import { LoginDto, RegDto } from '../swagger/dto';
import { LoginRes, RegRes } from '../swagger/res';
import MAIN_CONFIG from '../config';
import AuthService from '../service/auth';

@Controller('/auth')
@ApiTags('登录模块')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @ApiOperation({ description: '登录', summary: '登录' })
  @ApiBody({
    description: '登录',
    type: LoginDto,
  })
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
  @ApiOperation({ description: '退出登录', summary: '退出登录' })
  @ApiBody({
    description: '退出登录',
  })
  @ApiOkResponse({ status: 200 })
  logout(@Req() req: Request) {
    return this.authService.logout(req);
  }

  @Post('/reg')
  @ApiOperation({ description: '注册', summary: '注册' })
  @ApiBody({
    description: '注册',
    type: RegDto,
  })
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
}
