---
layout: post
title: Weex 学习笔记
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

因为不能使用组合选择器，所以不可以直接使用sass。如果要使用可查阅别的资料，下载node-sass,sass-loader，然后在weex-css-loader中添加配置。


## 与web的差异

### 不能在div中写文本，文本只能写在text中

### image

不能使用img，使用image，而且要手动闭合，所有的image要设置width和height。


## scroller, list， recycle-list

scroller和list不能相互嵌套相同方向的list和scroller，切记！

recycle-list在渲染过程中会出现一些问题，已经提issue。

## 


