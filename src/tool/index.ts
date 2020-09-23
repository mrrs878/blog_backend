/*
 * @Author: your name
 * @Date: 2020-09-23 15:36:29
 * @LastEditTime: 2020-09-23 15:40:38
 * @LastEditors: your name
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
