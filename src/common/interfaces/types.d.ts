/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-09 18:00:43
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-11 22:18:01
 * @FilePath: \blog_backend\src\common\interfaces\types.d.ts
 */
interface Res<T> {
  return_code: number;
  return_message: string;
  data?: T;
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
  role: number;
  avatar: string;
  created_by: number;
  profession: string;
  tags: Array<string>;
  signature: string;
  department: string;
  address: string;
  teams: Array<string>;
  update_time?: string;
  create_time: string;
  status: number;
}

interface MenuItemI {
  key: string;
  icon?: Record<string, unknown>;
  icon_name?: string;
  title: string;
  path?: string;
  sub_menu?: Array<string>;
  parent: string;
  position: number;
  role?: Array<number>;
  status?: number;
  create_time?: Date;
  update_time?: Date;
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
  creator: string;
  updater: string;
}

interface CommentI {
  name: string;
  content: string;
  user_id: string;
  article_id: string;
  create_time: string;
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

interface IGetBusBaseRes {
  end_latetime: string;
  start_stop: string;
  start_earlytime: string;
  start_latetime: string;
  line_name: string;
  end_earlytime: string;
  line_id: string;
  end_stop: string;
}

interface IGetBusStopsRes {
  lineResults0: {
    stops: Array<{
      zdmc: string;
      id: string;
    }>;
    direction: boolean;
  };
  lineResults1: {
    stops: Array<{
      zdmc: string;
      id: string;
    }>;
    direction: boolean;
  };
}

interface IGetArriveBaseRes {
  cars: Array<{
    stopdis: string;
    distance: string;
    terminal: string;
    time: string;
  }>;
}

interface IGetBusBaseReq {
  name: string;
}

interface IGetBusStopsReq {
  name: string;
  lineid: string;
}

interface IGetArriveBaseReq {
  name: string;
  lineid: string;
  stopid: string;
  direction: number;
}
