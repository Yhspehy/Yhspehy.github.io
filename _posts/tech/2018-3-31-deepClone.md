---
layout: post
title: deepClone的研究
tag: 技术
keywords: deepClone
---

该篇博客主要来源于[这里](https://juejin.im/post/5abb55ee6fb9a028e33b7e0a)，并在此基础上做了部分修改。

所起深克隆，我们肯定会想到JSON.paras(JSON.stringify(obj))，但是他有一些弊端：
1. 他无法实现对函数 、RegExp、new Array(3)等特殊对象的克隆。
2. 会抛弃对象的constructor,所有的构造函数会指向Object。
3. 对象有循环引用,会报错

但是接下来这个深拷贝可以解决上述问题。

```js

// 用来判断数据的类型，后期可在这里添加其他类型的数据
const isType = (obj, type) => {
  if (typeof obj !== 'object') return false;
  const typeString = Object.prototype.toString.call(obj);
  let flag;
  switch (type) {
    case 'Array':
    flag = typeString === '[object Array]';
    break;
    case 'Date':
    flag = typeString === '[object Date]';
    break;
    case 'RegExp':
    flag = typeString === '[object RegExp]';
    break;
    default:
    flag = false;
  }
  return flag;
};

// 获取正则的相关参数
const getRegExp = re => {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
};


/**
* deep clone
* @param  {[type]} parent object 需要进行克隆的对象
* @return {[type]}        深克隆后的对象
*/
const clone = parent => {
  // 维护两个储存循环引用的数组
  const parents = [];
  const children = [];

  const _clone = parent => {
    if (parent === null) return null;
    if (typeof parent !== 'object') return parent;

    let child, proto;

    if (isType(parent, 'Array')) {
      // 对数组做特殊处理
      console.log(parent)
      child = [];
    } else if (isType(parent, 'RegExp')) {
      // 对正则对象做特殊处理
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (isType(parent, 'Date')) {
      // 对Date对象做特殊处理
      child = new Date(parent.getTime());
    } else {
      // 处理对象原型
      proto = Object.getPrototypeOf(parent);
      // 利用Object.create切断原型链
      child = Object.create(proto);
    }

    // 处理循环引用
    const index = parents.indexOf(parent);

    if (index != -1) {
      // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
      return children[index];
    }
    parents.push(parent);
    children.push(child);

    if (Array.isArray(child)) {
      parent.push(1)
      for (let i in parent) {
        hild[i] = _clone(parent[i]);
      }
      child.splice(-1)
      parent.splice(-1)
    } else {
      for (let i in parent) {
        child[i] = _clone(parent[i]);
      }
    }

    return child;
  };
  return _clone(parent);
};



function person(pname) {
  this.name = name;
}

const fn = new person('fn');

// 函数
function say() {
  console.log('hi');
};

let bb = new Array(2)

const oldObj = {
  a: say,
  b: bb,
  c: new RegExp('ab+c', 'i'),
  d: fn
};

const newObj = clone(oldObj);

const jsonObj = JSON.parse(JSON.stringify(oldObj))

console.log(newObj, oldObj, jsonObj);

 ```
