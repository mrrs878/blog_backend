/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-09 18:20:05
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 22:10:38
 * @FilePath: \blog_backend\src\common\tool\index.ts
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

export function isEmptyObject(obj: Record<string, any>) {
  if (!obj) return true;
  return Reflect.ownKeys(obj).length === 0;
}

export function obj2QueryString(params: any) {
  const str = (Reflect.ownKeys(params) as Array<string>).reduce(
    (pre, cur) => `${pre}&${cur}=${params[cur]}`,
    '',
  );
  return str.slice(1).replace(/\+/g, '%2b');
}

export function getNow() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return dayjs(new Date()).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}
