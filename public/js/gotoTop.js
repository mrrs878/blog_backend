/*
 * @Author: your name
 * @Date: 2020-11-30 22:48:54
 * @LastEditTime: 2020-11-30 22:55:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\public\js\gotoTop.js
 */
const gotoTopDOM = document.querySelector('#gotoTopC');
gotoTopDOM.addEventListener('click', () => {
  window.scrollTo(0, 0);
});
window.addEventListener('scroll', () => {
  const { y } = document.querySelector('.context')?.getBoundingClientRect() || { y: 0 };
  if (y < -1000) {
    gotoTopDOM?.classList.add('active');
  } else {
    gotoTopDOM?.classList.remove('active');
  }
});
