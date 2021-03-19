/*
 * @Author: mrrs878
 * @Date: 2020-09-24 18:39:15
 * @LastEditTime: 2020-09-24 18:41:33
 * @LastEditors: mrrs878@foxmail.com
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\guards\auth.ts
 */
import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

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
