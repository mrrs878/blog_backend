/*
 * @Author: your name
 * @Date: 2020-09-23 19:08:02
 * @LastEditTime: 2020-09-23 19:18:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\filter\httpException.ts
 */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { EXCEPTION_MSG } from 'src/constant/exceptionMsg';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).json({
      code: status,
      success: false,
      msg: EXCEPTION_MSG[status],
    });
  }
}
