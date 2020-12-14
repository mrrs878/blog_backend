/*
 * @Author: your name
 * @Date: 2020-11-27 15:58:55
 * @LastEditTime: 2020-12-14 23:16:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\public\js\menu.js
 */
const menuDOM = {
  menuContainer: document.querySelector('.menu'),
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
  const { y } = menuDOM.menuContainer?.getBoundingClientRect() || { y: 0 };
  if (y < -450) {
    menuDOM.searchInputC?.classList.add('float');
  } else {
    menuDOM.searchInputC?.classList.remove('float');
  }
}

function setupFlip(tick) {
  window.Tick.helper.interval(() => {
    const [, hour, min] = Date().match(/(\d+):(\d+):(\d+)/) || [0, 0, 0, 0];
    const tmp = `${hour}:${min}`;
    tick.value = tmp;
    tick.root.setAttribute('aria-label', tmp);
  }, 1000);
}

function initEvent() {
  menuDOM.searchInput?.addEventListener('focus', onInputFocus);
  menuDOM.searchClear?.addEventListener('click', onClearIconClick);
  menuDOM.searchInput?.addEventListener('keyup', onInputEnterPress);
  window.addEventListener('scroll', onWindowScroll);
  setupFlip.setupFlip = setupFlip;
}

initEvent();
