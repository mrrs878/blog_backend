/*
 * @Author: mrrs878
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-24 16:57:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\config\index.ts
 */
const MAIN_CONFIG = {
  db: process.env.NODE_ENV === 'production' ? 'mongodb://blog_database' : 'mongodb://127.0.0.1:27017/article',
  SECRET: 'admin888',
  ROLE: {
    SUPER_ADMIN: 0,
    ADMIN: 1,
    DEVELOPER: 2,
    HUMAN: 3,
  },
};

export default MAIN_CONFIG;
