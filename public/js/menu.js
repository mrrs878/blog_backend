/*
 * @Author: your name
 * @Date: 2020-11-27 15:58:55
 * @LastEditTime: 2020-11-27 17:05:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\public\js\menu.js
 */
const menuDOM = {
  searchInput: document.querySelector('.search-c .search'),
  searchInputC: document.querySelector('.search-c'),
  searchClear: document.querySelector('.search-c .close-icon'),
};

function searchByKeywords(keywords) {
  window.location.href = keywords !== ''
    ? `/blog/view/keyword/${keywords}`
    : '/blog/view';
}

function onInputFocus() {
  menuDOM.searchClear?.classList.add('active');
}
function onClearIconClick() {
  menuDOM.searchClear?.classList.remove('active');
  if (!menuDOM.searchInput) return;
  menuDOM.searchInput.value = '';
}
function onInputEnterPress(e) {
  if (e.code !== 'Enter') return;
  searchByKeywords(menuDOM.searchInput?.value);
  onClearIconClick();
}
function onWindowScroll() {
  const { y } = menuDOM.searchInputC?.getBoundingClientRect() || { y: 0 };
  if (y <= 0) {
    menuDOM.searchInputC?.classList.add('float');
  } else {
    menuDOM.searchInputC?.classList.remove('float');
  }
}

function initEvent() {
  menuDOM.searchInput?.addEventListener('focus', onInputFocus);
  menuDOM.searchClear?.addEventListener('click', onClearIconClick);
  menuDOM.searchInput?.addEventListener('keyup', onInputEnterPress);
  window.addEventListener('scroll', onWindowScroll);
}

initEvent();
