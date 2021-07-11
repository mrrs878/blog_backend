/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-11 15:38:33
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 17:03:34
 * @FilePath: \blog_backend\src\common\config\log4j.ts
 */
import { resolve } from 'path';

const BASE_PATH = resolve(__dirname, '../../log');

const log4jsConfig = {
  appenders: {
    console: {
      type: 'console',
    },
    access: {
      type: 'dateFile',
      filename: `${BASE_PATH}/access/access.log`,
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      numBackups: 3,
      category: 'http',
      keepFileExt: true,
    },
    app: {
      type: 'dateFile',
      filename: `${BASE_PATH}/app-out/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      numBackups: 3,
      keepFileExt: true,
    },
    errorFile: {
      type: 'dateFile',
      filename: `${BASE_PATH}/errors/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      numBackups: 3,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: {
      appenders: ['console', 'app', 'errors'],
      level: 'DEBUG',
    },
    info: { appenders: ['console', 'app', 'errors'], level: 'info' },
    access: { appenders: ['console', 'app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' },
  },
  pm2: true,
  pm2InstanceVar: 'INSTANCE_ID',
};

export default log4jsConfig;
