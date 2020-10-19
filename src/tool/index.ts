/*
 * @Author: mrrs878
 * @Date: 2020-09-23 15:36:29
 * @LastEditTime: 2020-10-15 17:11:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\tool\index.ts
 */
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';

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
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}
