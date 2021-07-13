/* eslint-disable max-classes-per-file */
/*
 * @Author: mrrs878
 * @Date: 2020-09-24 09:59:14
 * @LastEditTime: 2020-09-24 10:22:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_dashboard\src\tools\log4j.ts
 */
import * as Path from 'path';
import * as Log4js from 'log4js';
import * as Util from 'util';
import * as dayjs from 'dayjs';
import * as StackTrace from 'stacktrace-js';
import Chalk from 'chalk';
import config from '../config/log4j';

export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF'
}

export class ConetxtTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number,
  ) {}
}

Log4js.addLayout('blog-api', (logConfig) => (logEvent) => {
  let moduleName = '';
  let position = '';

  // 日志组装
  const messageList: Array<string> = [];
  logEvent.data.forEach((item) => {
    if (item instanceof ConetxtTrace) {
      moduleName = item.context;
      if (item.lineNumber && item.columnNumber) {
        position = `${item.lineNumber}, ${item.columnNumber}`;
      }
      return;
    }

    if (typeof item !== 'string') {
      item = Util.inspect(item, false, 3, true);
    }

    messageList.push(item);
  });

  // 日志组成部分
  const messageOutput = messageList.join('');
  const positionOutput = position ? `[ ${position} ]` : '';
  const typeOutput = `[${
    logConfig.type
  }] ${logEvent.pid.toString()}   - `;
  const dateOutput = `${dayjs(logEvent.startTime).format(
    'YYYY-MM-DD HH:mm:ss',
  )}`;
  const moduleOutput = moduleName
    ? `[${moduleName}] `
    : '[LoggerService] ';
  let levelOutput = `[${logEvent.level}] ${messageOutput}`;

  switch (logEvent.level.toString()) {
    case LoggerLevel.DEBUG:
      levelOutput = Chalk.green(levelOutput);
      break;
    case LoggerLevel.INFO:
      levelOutput = Chalk.cyan(levelOutput);
      break;
    case LoggerLevel.WARN:
      levelOutput = Chalk.yellow(levelOutput);
      break;
    case LoggerLevel.ERROR:
      levelOutput = Chalk.red(levelOutput);
      break;
    case LoggerLevel.FATAL:
      levelOutput = Chalk.hex('#DD4C35')(levelOutput);
      break;
    default:
      levelOutput = Chalk.grey(levelOutput);
      break;
  }

  return `${Chalk.green(typeOutput)}${dateOutput}  ${Chalk.yellow(
    moduleOutput,
  )}${levelOutput}${positionOutput}`;
});

Log4js.configure(config);

const logger = Log4js.getLogger();
logger.level = LoggerLevel.TRACE;

export class Logger {
  static trace(...args) {
    logger.trace(Logger.getStackTrace(), ...args);
  }

  static debug(...args) {
    logger.debug(Logger.getStackTrace(), ...args);
  }

  static log(...args) {
    logger.info(Logger.getStackTrace(), ...args);
  }

  static info(...args) {
    logger.info(Logger.getStackTrace(), ...args);
  }

  static warn(...args) {
    logger.warn(Logger.getStackTrace(), ...args);
  }

  static warning(...args) {
    logger.warn(Logger.getStackTrace(), ...args);
  }

  static error(...args) {
    logger.error(Logger.getStackTrace(), ...args);
  }

  static fatal(...args) {
    logger.fatal(Logger.getStackTrace(), ...args);
  }

  static access(...args) {
    const loggerCustom = Log4js.getLogger('http');
    loggerCustom.info(Logger.getStackTrace(), ...args);
  }

  // 日志追踪，可以追溯到哪个文件、第几行第几列
  static getStackTrace(deep = 2): string {
    const stackList: StackTrace.StackFrame[] = StackTrace.getSync();
    const stackInfo: StackTrace.StackFrame = stackList[deep];

    const { lineNumber } = stackInfo;
    const { columnNumber } = stackInfo;
    const { fileName } = stackInfo;
    const basename: string = Path.basename(fileName);
    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`;
  }
}
