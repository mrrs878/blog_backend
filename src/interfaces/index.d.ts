/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-24 17:10:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\interfaces\index.d.ts
 */
interface Res<T> {
  success: boolean;
  code: number;
  msg: string;
  data?: T
}

interface FileI {
  filename: string;
  originalname: string;
  buffer: Buffer;
  size: number;
}

interface UserI {
  name: string;
  password: string;
  salt: string;
  role?: number;
}

interface RegBodyI extends UserI {
  repassword: string;
}

interface LoginBodyI {
  name: string;
  password: string;
}
