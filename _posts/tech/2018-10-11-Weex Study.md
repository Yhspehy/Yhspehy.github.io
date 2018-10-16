---
layout: post
title: Weex 学习笔记以及踩坑记录
tag: 技术
keywords: Weex
---

# 背景
自从关注移动端性能之后发现需要学习的东西越来越多，先是浏览器的动销分析，然后cordova使用，再到现在多weex学习，emm，真好！


然后我又接触到了eros。。。

## 样式问题

### 不能使用百分比，只支持px

### 不能通过:style动态绑定样式

如果要动态绑定样式，可以通过切换class来实现


### refresh样式

refresh在ios测试时，如果下拉的距离超过了viewHeight，那么会执行刷新操作，但是多拉出的距离的背景是白色的，和网页demo是不一样，网页demo下拉的背景都是refresh设置的背景颜色。

### 不能使用组合选择器

如果要使用可查阅别的资料，下载node-sass,sass-loader，然后在weex-css-loader中添加配置。
但是因为不能使用组合选择器，所以我觉得sass的用处也不是很大。

---

## 与web的差异

### 不能在div中写文本，文本只能写在text中

这点非常重要，好几次都是因为这个导致显示对问题。

而且text是不会继承div对css的。

### image

不能使用img，使用image，而且要手动闭合，所有的image要设置width和height。

---

## scroller, list， recycle-list

scroller和list不能相互嵌套相同方向的list和scroller，切记！

recycle-list中也不能嵌套相同方向的list和scroller，不能使用refresh。

recycle-list在渲染过程中会出现一些问题，已经提issue。

[dotwe example](http://dotwe.org/vue/9fa9d2f489d1988f7334aeabcae802df)

[github issue](https://github.com/apache/incubator-weex/issues/1629)

---

## refresh的问题

在使用refresh的时候，如果页面元素数量发生变化，页面会上移一段距离。

哇，好鸡儿坑哦。！！！！已经提了issue。

[github issue](https://github.com/apache/incubator-weex/issues/1633)

---

## 底部设置footer的问题

[dotwe example](http://dotwe.org/vue/ab28e101498e78b1730251a727838c5f)
在iOS，iphonexs上，如果设置了border-top，那么在页面滑动的时候footer底部会有1px的空间来显示`<recycle-list></recycle-list>`里点内容，我猜想是因为设置了border-top的时候默认也设置了相同宽度对border-bottom，但是我们并没有设置border-bottom对属性，所以会显示下个层级对内容。

可以采取的办法是：设置相同宽度对border-bottom，并且color为transparent；


---

## WeexPlayground

常常代码改动后等重新打完包再在手机中刷新，不然就报错，如果报错了就重新保存下。


## OVER

是时候从入门到放弃了，真的有点不能忍了！！