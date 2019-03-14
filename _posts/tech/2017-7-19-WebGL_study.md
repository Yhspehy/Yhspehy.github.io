---
layout: post
title: WebGL的学习
tag: 技术
keywords: WebGL
---

WebGL，是一项用来在网页上绘制和渲染复杂三维图形（3D 图形），并允许用户与之进行交互的技术。由于现在个人计算机和浏览器的性能越来越高，WebGL 技术在各种电子设备上出现的概率也大大的提高了。WebGL 基于 HTML5 的 canvas 标签，便能够在网页上绘制二维以及三维图形，而且你不用去搭建开发环境，WebGL 是内嵌在浏览器中的，你不需要常规的开发工具，只需要一个支持 WebGL 的浏览器来运行。

WebGL 的学习主要通过 WebGL 编程指南这本书。

### WebGL 的入门

学习 WebGL，就必须先学会使用 canvas，canvas 是 HTML5 新支持的标签，用来动态的绘制图形。

学习 canvas,网上有很多资料，比如[MDN 的 Canvas 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)。

首先我们要学会怎么获取 canvas 元素，如`var canvas = document.getElementById("id")`，怎么获取绘图的格式（上下文环境,2d 或者 3d）,如`var ctx = canvas.getContext('2d')`，然后一些普通的绘图 api，如`ctx.fillStyle`,`ctx.fillRect`等等。

因为 WebGL 是基于 OpenGL ES 的，所以 WebGL 命名绘图格式的时候都命名为 gl，如`var gl = getWebGLContext(canvas)`,getWebGLContext()函数被定义在 cuon-utils.js 中，是一个 WebGL 编程的辅助函数。

```text
WebGL使用gl.clearColor()来指定背景色。
gl.clearColor(red, green, blue, alpha),这里要注意的是由于WebGL是继承OpenGL的，它遵循传统的OpenGL颜色分量的取值范围，即0.0~1.0。
RGB的值越高，颜色就越亮；类似的，第四分量透明度的值越高，颜色就越不透明。
一旦指定了背景色，背景色就会常驻在WebGL系统中，如果你只想清空绘图区，而不改变背景色的话，不需要再调用这个方法，只需要调用`gl.clear()`函数。
```

```text
gl.clear(buffer)永之前制定到背景色清空绘图区域。它的参数要格外注意，这里并不是canvas，它的参数有三个:
1. gl.COLOR_BUFFER_BIT       //指定颜色缓存区
2. gl.DEPTH_BUFFER_BIT       //指定深度缓冲区
3. gl.STENCIL_BUFFER_BIT     //指定模板缓冲区

// 清空缓冲区的另两个默认颜色及其相关函数
gl.clearDepth(depth)
gl.clearStencil(s)
```

```text

```
