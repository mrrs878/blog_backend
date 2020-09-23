/*
 * @Author: your name
 * @Date: 2020-09-21 14:48:46
 * @LastEditTime: 2020-09-23 16:02:50
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\src\config\index.ts
 */
const MAIN_CONFIG = {
  db: process.env.NODE_ENV === 'production' ? 'mongodb://blog_database' : 'mongodb://127.0.0.1:27017/article',
  secret: 'admin888',
};

export default MAIN_CONFIG;
