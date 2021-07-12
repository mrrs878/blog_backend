/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 15:36:18
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 15:39:32
 * @FilePath: \blog_backend\src\common\filters\anyException.ts
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '../tool/log4j';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const logFormatted = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      Request original url: ${request.originalUrl}
      Method: ${request.method}
      IP: ${request.ip}
      Status code: ${status}
      Response: ${exception} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Logger.error(logFormatted);
    if (exception.code === 'PUG:SYNTAX_ERROR') {
      response.redirect('/blog/view/error');
      return;
    }
    response.status(status).json({
      code: status,
      success: false,
      data: {
        exception,
      },
      return_message: `Service Error: ${exception}`,
    });
  }
}
