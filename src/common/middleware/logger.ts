/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 15:44:51
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 15:45:16
 * @FilePath: \blog_backend\src\common\middleware\logger.ts
 */
import { Request, Response } from 'express';
import { Logger } from '../tool/log4j';

export function logger(req: Request, res: Response, next: () => void) {
  const code = res.statusCode;
  next();
  const logFormat = ` >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
    Status code: ${code}
    Params: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)} \n  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  `;
  if (code >= 500) {
    Logger.error(logFormat);
  } else if (code >= 400) {
    Logger.warn(logFormat);
  } else {
    Logger.access(logFormat);
    Logger.log(logFormat);
  }
}
