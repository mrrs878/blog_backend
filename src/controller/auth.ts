import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import AuthService from '../service/auth';
import { User } from '../models/user';

@Controller('/auth')
@ApiTags('登录模块')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/user')
  getAllUsers() {
    return this.authService.findAll();
  }

  @Post('/login')
  login(@Req() request: Request) {
    console.log(request);
    return this.authService.login();
  }
}
