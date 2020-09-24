/*
 * @Author: your name
 * @Date: 2020-09-23 19:08:02
 * @LastEditTime: 2020-09-24 18:10:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\filter\httpException.ts
 */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { EXCEPTION_MSG } from 'src/constant/exceptionMsg';
import { Logger } from 'src/tool/log4j';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      Request original url: ${request.originalUrl}
      Method: ${request.method}
      IP: ${request.ip}
      Status code: ${status}
      Response: ${exception.toString()} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Logger.info(logFormat);
    response.status(200).json({
      code: status,
      success: false,
      data: {
        error: exception.message,
      },
      msg: EXCEPTION_MSG[status],
    });
  }
}
