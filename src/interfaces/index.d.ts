/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-10-14 19:10:19
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
  createTime: string;
  create_by: number;
}

interface MenuItemI {
  key: string;
  icon?: Record<string, unknown>;
  icon_name?: string;
  title: string;
  path?: string;
  sub_menu?: Array<string>;
  parent: string;
  role?: Array<number>;
  status?: number;
  createTime?: string;
  updateTime?: string;
}

interface DictI {
  status: number;
  create_time: number;
  label: string;
  label_view: string;
  type: string;
  type_view: string;
  name: string;
  name_view: string;
  value: number;
}

interface CommentI {
  name: string;
  content: string;
  user_id: string;
  article_id: string;
  createTime: string;
  avatar?: string;
}

interface RegBodyI extends UserI {
  repassword: string;
}

interface LoginBodyI {
  name: string;
  password: string;
}

interface AddMenuBodyI {
  key: string;
  icon_name?: string;
  title: string;
  path?: string;
  parent: string;
  role?: Array<number>;
}

interface UpdateMenuBodyI {
  key: string;
  icon_name?: string;
  title: string;
  path?: string;
  parent: string;
  role?: Array<number>;
}

interface AddCommentBodyI {
  name: string;
  content: string;
  user_id: string;
  article_id: string;
}
