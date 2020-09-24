/*
 * @Author: your name
 * @Date: 2020-09-23 16:04:31
 * @LastEditTime: 2020-09-23 19:04:21
 * @LastEditors: mrrs878
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\tool\jwt.ts
 */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import MAIN_CONFIG from 'src/config';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: MAIN_CONFIG.SECRET,
    });
  }

  async validate(payload: any) {
    console.log(payload);

    return payload;
  }
}
