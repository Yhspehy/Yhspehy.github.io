---
layout: post
title: Eros Study
tag: 技术
keywords: Eros
---


## Eros

不得不说，Weex的坑有点多，在我尝试了许多原生组件并发现都有一定的问题后，而且许多功能组件还是需要自己自制去兼容各个设备。所以现在我决定去试试Eros，在Weex的基础上封装的另一个框架。

用了一天，感觉还不错，而且官方文档写的很详细，这里先记录一下一些容易忘记的点。


## 安装环境

照着官方的文档做就行了，mac最好下一个rvm，安装一个2.5.1版本的ruby，但是这时候gem的版本是2.7.7，文档说要小于等于2.7.6，那我们就只要做一下降级处理就好，记得带上-force。

我之前没有将gem降级，在xcode中编译中就发现有问题。

由于使用的是xcode10，在编译中还发现一个问题。项目中依赖了lstdc++.6.0.9。但是xcode10中已经remove了这个。[解决办法](https://www.jianshu.com/p/6d94278d62b3),由于我只缺少lstdc++.6.0.9，所以我就往4个文件夹中添加了6.0.9的文件，另外几个没有添加。


## topBar

我在使用这个时候发现重新eros dev之后重新打开app并没有用。

解决办法：重新打包app，将之前的app删除，重新在xcode中导出即可。

所以只要和native.js有关的文件如果更改了，就需要重新打包app。



## Iphonex兼容

如果不实用导航栏，那么在iphonex中发现页面会占据刘海的区。
解决方式：使用全局属性的statusBarHeight，这个可以在官方的demo中看到他的使用方法。

使用导航栏的时候，statusBarHeight的值为0，所以如果这个时候你隐藏了导航栏，那么页面就到刘海区了。

## 热更新

今天重启了一下电脑，然后发现eros热更新连不上了。。。明明在一个局域网里，但是就是连不上。

可以在`eros.native.js`中设置socketServer和jsServer。

[链接](https://bmfe.github.io/eros-docs//#/zh-cn/QA?id=q-%E7%83%AD%E5%88%B7%E6%96%B0%E4%B8%8D%E8%B5%B7%E4%BD%9C%E7%94%A8%EF%BC%88%E6%89%8B%E5%8A%A8%E6%8C%87%E5%AE%9A%E6%9C%8D%E5%8A%A1%E5%9C%B0%E5%9D%80%EF%BC%89)