/*
 * @Author: your name
 * @Date: 2020-11-20 17:19:13
 * @LastEditTime: 2021-03-03 15:14:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\public\js\detail.js
 */
const element = document.querySelector('.content');
element.innerHTML = window.article.content;

window.hljs.initHighlightingOnLoad();
