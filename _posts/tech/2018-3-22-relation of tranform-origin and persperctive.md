---
layout: post
title: perspective-origin和transfrom-origin的深入理解
tag: 技术
keywords: perspective
---

## perspective-origin和transfrom-origin的深入理解

一看标题的这两个词汇，也许很多人都能马上说出他们的区别，一个是舞台视野的位置，一个是变换的位置。但是当他们混合用在一起的时候可能我们就不一定能分的那么清楚了，在我阅读`css揭秘`这门书的时候，看到了一个等腰梯形的css实现方法。


## 探究原因

```css
<style>
  .trapezoid {
    width: 100px;
    height: 50px;
    position: relative;
    margin: 20px auto;
    line-height: 50px;
    text-align: center;
    color: black;

  }

  .trapezoid::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    background: #fff;
    border: 1px solid rgba(0,0,0,4);
    border-radius: 4px;
  }

  .middle::before {
    transform-origin: bottom;
    transform: perspective(20px) scaleY(1.3) rotateX(10deg);
  }

  .right::before {
    transform-origin: left bottom;
    transform: perspective(20px) scaleY(1.3) rotateX(10deg);
  }
  
  .left::before {
    transform-origin: right bottom;
    transform: perspective(20px) scaleY(1.3) rotateX(10deg);
  }
</style>
  
  <div class="trapezoid middle">Middle</div>

  <div class="trapezoid left">Left</div>

  <div class="trapezoid right">Right</div>
```

<style>
  .trapezoid {
    width: 100px;
    height: 80px;
    position: relative;
    margin: 20px auto;
    line-height: 80px;
    text-align: center;
    color: black;

  }

  .trapezoid::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    background: #fff;
    border: 1px solid rgba(0,0,0,4);
    border-radius: 4px;
  }

  .middle::before {
    transform-origin: bottom;
    transform: perspective(20px) scaleY(1.3) rotateX(10deg);
  }

  .right::before {
    transform-origin: left bottom;
    transform: perspective(20px) scaleY(1.3) rotateX(10deg);
  }
  
  .left::before {
    transform-origin: right bottom;
    transform: perspective(20px) scaleY(1.3) rotateX(10deg);
  }
</style>

<div class="trapezoid middle">Middle</div>

关于这个图形，其实我一开始想到的是通过border-bottom不为transparent来实现的，不过不好设置border-radius，而他使用的是transfrom，便可以很完美的绘制出这个图。

接着他又说如果改变transform-origin为`left bottom` 或 `right bottom`的话，则可以得到右倾斜和左倾斜的梯形。

<div class="trapezoid left">Left</div>

<div class="trapezoid right">Right</div>


## 测试猜想

读到这里我就不是很明白了，rotateX是沿着x轴进行旋转，但是设置transform-origin为`left bottom`和`right bottom`的时候他们的x轴还是一样的，为什么就会产生这种情况呢？

于是我便去测试来寻找答案。

首先我知道`perspective`有两种写法，一种是写在父元素(即舞台)上，或者写在变换元素上(每个元素独自计算)，而且我看他们最后的形状像极了将`perspective-origin`设置在父元素上值为两边底角所得到的结果，所以我先写这2个测试demo。（perspective-origin设置在变换元素上无效）

```css
  <style>
   /*测试demo*/
  .left-demo {
    perspective: 20px;
    perspective-origin: left bottom;
  }

  .left-demo::before {
    animation: rotate 5s infinite;
  }

  

  .right-demo {
    perspective: 20px;
    perspective-origin: right bottom;
  }

  .right-demo::before {
    animation: rotate 5s infinite;
  }

  @keyframes rotate {
    to {
      transform: rotateX(10deg);
    }
  }
</style>


<div class="trapezoid left-demo">Left</div>

<div class="trapezoid right-demo">Right</div>
```

<style>
   /*测试demo*/

  /*trapezoid使用的之前的css*/

  .left-demo {
    perspective: 20px;
    perspective-origin: left bottom;
  }

  .left-demo::before {
    animation: rotate 5s infinite;
  }

  .right-demo {
    perspective: 20px;
    perspective-origin: right bottom;
  }

  .right-demo::before {
    animation: rotate 5s infinite;
  }

  @keyframes rotate {
    to {
      transform: rotateX(10deg);
    }
  }
</style>


<div class="trapezoid left-demo">Left</div>

<div class="trapezoid right-demo">Right</div>


很明显，这2个方法绘制的图形是一样的（图形高度比例可能不同，但原理相同）,所以我猜测，当将`perspective`设置在变换的元素上的时候，由于没有父元素舞台，这个时候你设置`transfrom-origin`的时候，其实不仅修改了元素变换的位置，还同时改变了视野的位置，即`perspective-origin`。

接着我又猜想，如果我在父元素上设置了`perspective和transform-origin`，也在该元素上设置了，那会出现什么情况呢？

## 探究其他特性

```css
<style>
  .left-demo-both {
    perspective: 20px;
    perspective-origin: left bottom;
  }

  .left-demo-both::before {
    animation: rotate 5s infinite;
    transform-origin: left bottom;
  }

  @keyframes rotate-both {
    to {
      transform: perspective(20px) rotateX(10deg);
    }
  }
</style>

<div class="trapezoid left-demo-both">Left</div>
```

<style>

  .left-demo-both {
    perspective: 20px;
    perspective-origin: left bottom;
  }

  .left-demo-both::before {
    animation: rotate 5s infinite;
    transform-origin: left bottom;
  }

  @keyframes rotate-both {
    to {
      transform: perspective(20px) rotateX(10deg);
    }
  }
</style>

<div class="trapezoid left-demo-both">Left</div>


和上面的一比较，发现形状还是没有变，但是大小又变了。我打开F12，选中该元素查看结果发现，让你在变换元素上设置`perspective和transform-origin`后，他的形状和单独给变换元素设置的大小是一样的，底边为原始宽度，而如果在父元素（即舞台）上设置的话，他的斜边中点和另一边的长度为原始宽度。  
而当我去掉子元素的before中的`perspective(20px)`的时候，发现图形并没有变化，这说明，父元素的`perspective`会覆盖变换元素，通过修改父元素的`perspective:50px`也可得出相同结论。  
当然还可以修改别的参数设对照来查看这几个属性对变换的影响，后续测试我就不贴出来了，直接说结论吧。


## 结论

划重点划重点（结论）：
1. 当只在变换元素上设置`perspective和transform-origin`，图形样子相当于在舞台上设置`perspective和perspective-origin`，但是前者最大的边的长度为元素原始长度，后者斜边的中点相连为元素原始长度。借机弥补了不能在变换元素上设置`perspective-origin`。
2. 当舞台设置了`perspective-origin`的时候，舞台的`perspective`会覆盖子元素设置的`perspective`值，但是如果舞台没有设置了`perspective-origin`,则不会覆盖，而是会`重叠`（对，效果重叠，变换的会异常大！！！你们可以试试）。
3. 写着写着忘了还有啥结论了，以后又测试到了再补充！



