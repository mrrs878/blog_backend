/*
 * @Author: mrrs878
 * @Date: 2020-09-23 15:36:29
 * @LastEditTime: 2021-01-26 23:34:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\tool\index.ts
 */
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

export function makeSalt() {
  return crypto.randomBytes(3).toString('base64');
}

export function encryptPwd(pwd: string, salt: string) {
  if (!pwd || !salt) return '';
  const tmpSalt = Buffer.from(salt, 'base64');
  return crypto.pbkdf2Sync(pwd, tmpSalt, 10000, 16, 'sha1').toString();
}

export function isObject(value: any) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function getNow() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return dayjs(new Date()).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}
