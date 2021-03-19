/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2020-11-27 15:58:55
 * @LastEditTime: 2021-03-04 18:35:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \blog_backend\public\js\menu.js
 */
const menuDOM = {
  menuContainer: document.querySelector('.menu'),
  searchInput: document.querySelector('.search-c .search'),
  searchInputC: document.querySelector('.search-c'),
  searchClear: document.querySelector('.search-c .close-icon'),
  catalogC: document.querySelector('#catalogC'),
};

function lastItem(array) {
  if (!Array.isArray(array)) return {};
  if (array.length === 0) return {};
  return array[array.length - 1];
}

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
    menuDOM.catalogC?.classList.add('float');
  } else {
    menuDOM.searchInputC?.classList.remove('float');
    menuDOM.catalogC?.classList.remove('float');
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

function generateCatalogTree(contentStr) {
  const hxElements = contentStr.match(/<h[1,2,3][^>]*>.*?<\/h[1,2,3]>/ig) || [];
  const treeData = [];
  hxElements.forEach((item) => {
    const content = item.replace(/[<,h,1,2,3,>,/]/g, '');
    const level = parseInt((item.match(/^<h([1,2,3])/) || [])[1], 10);
    const tmp = { content, level, children: [] };
    if (lastItem(treeData)?.level && level > lastItem(treeData)?.level) lastItem(treeData).children.push(tmp);
    else treeData.push(tmp);
  });
  return treeData;
}

function walk(item) {
  debugger;
  const { children } = item;
  if (children.length > 0) return `<div><ul>${item.content}</ul><ul>${item.children.map(({ content }) => `<li>${content}</li>`).join('')}</ul></div>`;
  return `<ul>${item.content}</ul>`;
}

function generateCatalogDOM(tree) {
  const domStr = tree.map(walk);
  return domStr.flat().join('');
}

function initEvent() {
  menuDOM.searchInput?.addEventListener('focus', onInputFocus);
  menuDOM.searchClear?.addEventListener('click', onClearIconClick);
  menuDOM.searchInput?.addEventListener('keyup', onInputEnterPress);
  window.addEventListener('scroll', onWindowScroll);
  setupFlip.setupFlip = setupFlip;
}

function initDOW() {
  const treeData = generateCatalogTree(window.article.content);
  const domStr = generateCatalogDOM(treeData);
  console.log(domStr);
}

initEvent();
initDOW();
