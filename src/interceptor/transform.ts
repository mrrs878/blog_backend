/*
 * @Author: your name
 * @Date: 2020-09-24 10:56:20
 * @LastEditTime: 2020-09-24 17:14:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\interceptor\transform.ts
 */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Logger } from '../tool/log4j';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const { req } = context.getArgByIndex(1);
    return next.handle().pipe(
      map((data) => {
        const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          Request original url: ${req.originalUrl}
          Method: ${req.method}
          IP: ${req.ip}
          User: ${JSON.stringify(req.user)}
          Response data:\n ${JSON.stringify(data.data)}
          <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        `;
        Logger.info(logFormat);
        Logger.access(logFormat);
        return data;
      }),
    );
  }
}
