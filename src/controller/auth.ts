/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-23 18:50:57
 * @LastEditors: mrrs878
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\controller\auth.ts
 */
import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { JoiValidationPipe } from 'src/pipes';
import * as Joi from '@hapi/joi';
import { LoginDto, RegDto } from 'src/swagger/dto';
import { LoginRes, RegRes } from 'src/swagger/res';
import UserService from '../service/auth';

@Controller('/auth')
@ApiTags('登录模块')
export default class AuthController {
  constructor(
    private readonly userService: UserService,
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
    return this.userService.login(body);
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
  })))
  reg(@Body() body: RegBodyI) {
    return this.userService.reg(body);
  }
}
