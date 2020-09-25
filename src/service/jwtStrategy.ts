/*
 * @Author: your name
 * @Date: 2020-09-23 16:04:31
 * @LastEditTime: 2020-09-25 17:55:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\tool\jwt.ts
 */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import MAIN_CONFIG from 'src/config';
import CacheService from './cache';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: MAIN_CONFIG.SECRET,
    });
  }

  async validate(payload: any) {
    const isValidate = !!(await this.cacheService.get(payload.name));
    return isValidate ? payload : false;
  }
}
