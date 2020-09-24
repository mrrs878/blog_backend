/*
 * @Author: your name
 * @Date: 2020-09-24 15:24:45
 * @LastEditTime: 2020-09-24 17:01:16
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\interceptor\rabc.ts
 */
import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class RABCInterceptor implements NestInterceptor {
  constructor(private readonly role: number) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const { req } = context.getArgByIndex(1);
    if (req.user.role > this.role) {
      throw new ForbiddenException('对不起，您无权操作');
    }
    return next.handle();
  }
}
