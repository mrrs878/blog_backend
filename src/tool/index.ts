/*
 * @Author: your name
 * @Date: 2020-09-23 15:36:29
 * @LastEditTime: 2020-09-25 16:15:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\tool\index.ts
 */
import * as crypto from 'crypto';

export function makeSalt() {
  return crypto.randomBytes(3).toString('base64');
}

export function encryptPwd(pwd: string, salt: string) {
  if (!pwd || !salt) return '';
  const tmpSalt = Buffer.from(salt, 'base64');
  return crypto.pbkdf2Sync(pwd, tmpSalt, 10000, 16, 'sha1').toString();
}

export function isObject(value: any) {
  return Object.prototype.toString.call(value) === '[object Object]'
}