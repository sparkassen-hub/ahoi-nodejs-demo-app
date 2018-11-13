
const dom = {};
const $find = (query) => document.querySelector(query);
const $findAll = (query) => document.querySelectorAll(query);
const doc = document;

dom.ready = (callback) => {
  document.readyState !== 'loading' ? callback() : document.addEventListener('DOMContentLoaded', callback);
}


const addListeners = (nodes, types, handler) => {
  const typeArr = types.replace(/,/g, ' ').split(/\s+/);
  let nodeArr;
  if (typeof nodes === 'string') {
    nodeArr = [...document.querySelectorAll(nodes)];
  } else if (nodes instanceof HTMLCollection || nodes instanceof NodeList) {
    nodeArr = nodes;
  } else {
    nodeArr = [nodes];
  }
  for (const type of typeArr) {
    for (const node of nodeArr) {
      node.addEventListener(type, handler);
    }
  }
}

const getParentOrSelf = (element, tagName) => {
  const lcName = tagName.toLowerCase();
  if (!element || element.tagName.toLowerCase() === lcName) {
    return element;
  }
  let parent;
  for (parent = element; parent && parent.tagName.toLowerCase() != lcName; parent = parent.parentElement) { };
  return parent;
}

const removeClass = (selector, cssClass) => {
  _changeClass(selector, cssClass, false);
}

const addClass = (selector, cssClass) => {
  _changeClass(selector, cssClass, true);
}

const _changeClass = (selector, cssClass, isAdd) => {
  const elements = [...document.querySelectorAll(selector)];
  if (elements && elements.length) {
    for (element of elements) {
      isAdd ? element.classList.add((cssClass)) : element.classList.remove((cssClass));
    }
  }
}