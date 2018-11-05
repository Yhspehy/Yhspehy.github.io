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


## tool

copyString只能复制string，复制其他类型的数据。



## 使用iconfont

注意你引用或者下载的ttf以及其他格式的文件是否可以用，我在fontawesome官网中获取到的ttf就不可用`https://use.fontawesome.com/releases/v5.4.2/webfonts/fa-brands-400.ttf`,调试了很久才发现。

具体使用方式可以参照[官方文档](https://bmfe.github.io/eros-docs//#/zh-cn/base_extend?id=%E5%8A%A0%E8%BD%BD-iconfont-%E8%B5%84%E6%BA%90)。



## 将内置包更新，更新到native中的代码中

`eros pack <platform>`



## 打更新包

1. 首先在`eros.dev.js`中设置diff.pwd的路径，即你每次打包文件的目标路径，app上线的时候要把文件上到服务器上。
2. `eros.dev.js`中设置diff.proxy路径，即你每次在打包后调用服务器的add接口的时候，所传入的服务器上程序包的路径前缀。比如你传入的前缀是'http://192.168.1.7:3001/static/dist/js/',打出来的包名称是a.zip，那么你就可以访问'http://192.168.1.7:3001/static/dist/js/a.zip'来进行热更新。
3. 在eros-publish/server/config中设置staticRealPath，设置成服务器上程序包的文件路径。这样在第二步中他访问的就是你服务器上程序包的路径。
4. 在`eros-native.js`中设置bundleUpdate，即每次打开app所调用服务器上检查更新的接口，判断是否需要更新。


注意：官方文档中路径都是写localhost的，但是其实手机上访问localhost是访问不到电脑上的数据的，所以这里要改成电脑的ip。而且eros-publish中的app/check是get请求，不是post，官方文档有错误！

