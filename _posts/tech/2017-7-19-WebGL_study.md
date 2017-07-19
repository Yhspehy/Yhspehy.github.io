---
layout: post
title: WebGL的学习
tag: 技术
keywords: WebGL
---

WebGL，是一项用来在网页上绘制和渲染复杂三维图形（3D图形），并允许用户与之进行交互的技术。由于现在个人计算机和浏览器的性能越来越高，WebGL技术在各种电子设备上出现的概率也大大的提高了。WebGL基于HTML5的canvas标签，便能够在网页上绘制二维以及三维图形，而且你不用去搭建开发环境，WebGL是内嵌在浏览器中的，你不需要常规的开发工具，只需要一个支持WebGL的浏览器来运行。

WebGL的学习主要通过WebGL编程指南这本书。

### WebGL的入门

学习WebGL，就必须先学会使用canvas，canvas是HTML5新支持的标签，用来动态的绘制图形。

学习canvas,网上有很多资料，比如[MDN的Canvas教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)。

首先我们要学会怎么获取canvas元素，如`var canvas = document.getElementById("id")`，怎么获取绘图的格式（上下文环境,2d或者3d）,如`var ctx = canvas.getContext('2d')`，然后一些普通的绘图api，如`ctx.fillStyle`,`ctx.fillRect`等等。

因为WebGL是基于OpenGL ES的，所以WebGL命名绘图格式的时候都命名为gl，如`var gl = getWebGLContext(canvas)`,getWebGLContext()函数被定义在cuon-utils.js中，是一个WebGL编程的辅助函数。

```js
WebGL使用gl.clearColor()来清空绘图区并指定背景色。  
gl.clearColor(red, green, blue, alpha),这里要注意的是由于WebGL是继承OpenGL的，它遵循传统的OpenGL颜色分量的取值范围，即0.0~1.0。  
RGB的值越高，颜色就越亮；类似的，第四分量透明度的值越高，颜色就越不透明。  
一旦指定了背景色，背景色就会常驻在WebGL系统中，如果你只想清空绘图区，而不改变背景色的话，不需要再调用这个方法，只需要调用`gl.clear()`函数。
```

```text
gl.clear(buffer)的参数要格外注意，这里并不是canvas，它的参数有三个:
1. gl.COLOR_BUFFER_BIT       //指定颜色缓存区
2. gl.DEPTH_BUFFER_BIT       //指定深度缓冲区
3. gl.STENCIL_BUFFER_BIT     //指定模板缓冲区

// 清空缓冲区的另两个默认颜色及其相关函数
gl.clearDepth(depth)
gl.clearStencil(s)
```



