/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 15:35:19
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 15:35:44
 * @FilePath: \blog_backend\src\common\guards\auth.ts
 */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export class RBACGuard implements CanActivate {
  constructor(private readonly role: number) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    if (user.role > this.role) {
      throw new ForbiddenException('对不起，您无权操作');
    }
    return true;
  }
}
