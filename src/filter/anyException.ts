/*
 * @Author: mrrs878
 * @Date: 2020-09-23 19:08:02
 * @LastEditTime: 2021-05-27 10:16:51
 * @LastEditors: lihang.gw@heyqu.net
 * @Description: In User Settings Edit
 * @FilePath: /blog_backend/src/filter/anyException.ts
 */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'src/tool/log4j';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException
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
