---
layout: post
title: css揭秘阅读笔记
tag: 技术
keywords: css-magic
---

记录一些关于css的一些奇妙的方法。

## 背景与边框

### 多重边框

多重边框也是依靠box-shadow绘制而成。

```css
<style>
  .borders {
    width: 60px; height: 60px;
    border-radius: 50%;
    background: #fafafa;
    margin: 105px 29px;
    box-shadow: 0 0 0 10px #E8E2D6, 0 0 0 20px #E1D9C9,  
                0 0 0 30px #D9CFBB, 0 0 0 40px #D2C6AE,  
                0 0 0 50px #CABCA0, 0 0 0 60px #C3B393,
                0 0 0 70px #BBA985, 0 0 0 80px #B4A078;
  }
</style>
```

<style>
    .many-borders {
        width: 60px; height: 60px;
        margin: 120px auto;
        border-radius: 50%;
        background: #fafafa;
        box-shadow: 0 0 0 10px #E8E2D6, 0 0 0 20px #E1D9C9,  
                    0 0 0 30px #D9CFBB, 0 0 0 40px #D2C6AE,  
                    0 0 0 50px #CABCA0, 0 0 0 60px #C3B393,
                    0 0 0 70px #BBA985, 0 0 0 80px #B4A078;
    }
</style>

<div class="many-borders"></div>




### 条纹背景

条纹进度条使用的是`linear-gradient`绘制条纹，`keyframes`绘制动画。

```css
<style>
    .progress-outer {
        width: 60%; height: 12px;
        border-radius: 8px;
        overflow: hidden;
        position: relative; 
    }    
    .progress-enter {  
        height: inherit;
        background: rgba(180, 160, 120, .2); 
    }
    .progress-bg {
        width: 60%; height: inherit;
        border-radius: 6px; 
        background-size: 16px 16px;
        animation: panoramic 20s linear infinite;
        background: linear-gradient(-45deg, #D9CFBB  25%, #C3B393 0, #C3B393 50%,
            #D9CFBB 0, #D9CFBB 75%, #C3B393 0);
        // 关于这里的#C3B393 0，表示终止渐变，<color-stop> = <color> [ <percentage> | <length> ]。这里的0代表的是0px,表示在25%的时候#C3B393颜色的长度为0，当某个色标的位置值比整个列表中在它之前的色标的位置值都要笑，则该色标的位置值会被设置为它前面所有色标位置的最大值，所以他的长度为0，就相当于#C3B393 25%，然后#C3B393 50%表示在从之前的位置到50%都是#C3B393，所以就相当于这25%到50%没有发生渐变。

    }

    @keyframes panoramic{
        to {
            background-position: 200% 0;
        }
    }
</style>
```

<style>
    .progress-outer {
        width: 60%; height: 12px;
        border-radius: 8px;
        overflow: hidden;
        position: relative; 
        margin: 50px auto;
    }    
    .progress-enter {  
        height: inherit;
        background: rgba(180, 160, 120, .2); 
    }
    .progress-bg {
        width: 60%; height: inherit;
        border-radius: 6px; 
        background: linear-gradient(-45deg, #D9CFBB  25%, #C3B393 0, #C3B393 50%,
            #D9CFBB 0, #D9CFBB 75%, #C3B393 0);
        background-size: 16px 16px;
        animation: panoramic 20s linear infinite;
    }

    @keyframes panoramic{
        to {
            background-position: 200% 0;
        }
    }
</style>

<div class="progress-outer">
  <div class="progress-enter">
    <div class="progress-bg"></div>
  </div>
</div>





### 边框内角圆弧

因为box-shadow会在border外侧紧贴border，而outline则紧贴没有radius的border。所以两者一起使用可以使内边框产生一定的弧度。

```css
<style>
  .radius{
    width: 209px; 
    margin: 29px auto;
    padding: 8px 16px;
    border-radius: 8px;
    background: #f4f0ea;
    outline: 6px solid #b4a078;
    box-shadow: 0 0 0 6px #b4a078;
  }
</style>
```

<style>
    .inner-radius {
        width: 209px; 
        margin: 29px auto;
        padding: 8px 16px;
        border-radius: 8px;
        background: #f4f0ea;
        outline: 6px solid #b4a078;
        box-shadow: 0 0 0 6px #b4a078;
        color: #000;
    }
</style>

<div class="inner-radius">Here is some text!</div>


### 伪随机背景

所谓伪随机背景，就是我们不能通过肉眼观察到背景以某种规律排列。

在css揭秘中，他使用的方法的思想是，在一种颜色作为底色，然后其他的颜色覆盖在这个底色上，然后每隔一段距离重复。但是既然要生成伪随机背景，这个距离就要求他们的最小公倍数尽可能的大，因为他们的最小公倍数就是一个循环所需要的距离。
在总共使用4个背景的情况下，他使用的距离是`41,61,83`

```css
<style>
  .pesudo-random-bg {
    width: 400px;
    height: 100px;
    margin: 0 auto;
    background: hsl(20, 40%, 90%);
    background-image: linear-gradient(90deg, #fb3 11px, transparent 0),
                      linear-gradient(90deg, #ab4 23px, transparent 0),
                      linear-gradient(90deg, #655 41px, transparent 0);
    background-size: 41px 100%, 61px 100%, 83px 100%;
  }
</style>
```
<style>
  .pesudo-random-bg {
    width: 600px;
    height: 100px;
    margin: 0 auto;
    background: hsl(20, 40%, 90%);
    background-image: linear-gradient(90deg, #fb3 11px, transparent 0),
                      linear-gradient(90deg, #ab4 23px, transparent 0),
                      linear-gradient(90deg, #655 41px, transparent 0);
    background-size: 41px 100%, 61px 100%, 83px 100%;
  }
</style>

<div class="pesudo-random-bg"></div>

### 连续的图像边框

这个demo主要学习的是多个背景的添加以及border-image的设置。

```css
<style>
  .bg-within-words {
    width: 100px;
    height: 100px;
    padding: 20px;
    border: 20px solid transparent;
    background: linear-gradient(white, white), url(./bg.jpg);
    background-size: cover;
    background-clip: padding-box, border-box;   // 背景绘制的区域
    background-origin: padding-box, border-box;    // 背景图片相对于某个边框来定位
  }
</style>
```

<style>
  .bg-within-words {
    width: 100px;
    height: 100px;
    padding: 20px;
    border: 20px solid transparent;
    background: linear-gradient(white, white), url(/public/tech/css-magic/bg-within-words.jpg);
    background-size: cover;
    background-clip: padding-box, border-box;
    background-origin: border-box
  }
</style>

<div class="bg-within-words">Hey！</div>

顺便我还学习了border-image这个css属性，虽然以前用过它来写渐变的按钮背景，但是发现自己对它的相关属性还是不是很了解。主要是`border-image-slice`。有人说它和`background-clip`类似，但是我发现其实还是有很大出路的。因为`background-clip`是相对于左上角来写`top right bottom left`的距离，但是`border-image-slice`是相对于各个边来写距离。  
`border-image-width`会覆盖`border-width`。



## 形状

### 椭圆

由于平时我们用的border-radius都是单数据的，导致我们对这个属性了解的不深入，其实他实际包括了8个值：`border-radius: 左上 右上 右下 左下的水平半径 / 左上 右上 右下 左下的垂直半径`，注意这里的/之前都是水平，之后都是垂直。并不是通常我们认为的每个位置都是`左上水平/左上垂直 右上水平/右上垂直`这么定义的。

而且，boder-radius具有大值特性和等比例特性。大值特性指的是当定义的数值大于元素所能渲染的数值的时候，元素只会渲染所能够渲染的数值。而等比例特性是指各个角都按照所定义的水平/垂直比例。

了解了这些，我们就可以基于这个属性绘制多种图片了。

<style>
    .radius-divs div {
       width: 200px;
       height: 150px;
       margin: 20px;
       background: #fff;
       display: inline-block;
    }
    .radius-1 {
        border-radius: 50% / 100% 100% 0 0;
    }
    .radius-2 {
        width: 300px;
        border-radius: 50% / 0 100%;
    }
    .radius-3 {
        border-radius: 100% 0 0 0;
    }
</style>

<div class="radius-divs">
    <div class="radius-1"></div>
    <div class="radius-2"></div>
    <div class="radius-3"></div>
</div>

注意，当在border-radius中使用百分比的时候，如：  
```css
<style>
    width: 50px;
    height: 100px;
    border-radius: 50% / 100% 100% 0 0;    // 这个时候水平的radius为25px,垂直的radius为100px,这就相当于水平:垂直为1:4；

    那么就可以思考一下：
    border-radius: 50px / 100% 100% 0 0;
    border-radius: 100px / 100% 100% 0 0;
    border-radius: 100px / 25% 25% 0 0;
    等这些属性的不同，emmmm，我思考了这些思考了好久，总算是比较深入的理解了。

    诀窍是最好将百分比换算成px，然后再根据比例和宽高算出宽和高哪个是较小值，接着就可以清楚绘制出的图是什么样子的了！
</style>
```


### 菱形图片

菱形图片主要可以用rotate方法来实现，但是css揭秘中使用了`clip-path`方法，此前没有看过到，这里记录一下。

```css
<style>
  .img {
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);

    or

    tranform: rotate(-45deg) scale(1.42);
  }
</style>
```

### 梯形

关于梯形的制作，主要有2中方法：
1. 设置width和height，然后设置border属性，让其中的一边显示，另外三条边的border不显示。具体的角度控制可以通过设置临边的border的width来调节。
2. 通过rotateX来实现，具体的方法可以参考[我的这篇博客](http://127.0.0.1:4010/2018/03/22/relation-of-tranform-origin-and-persperctive.html)


### 切角效果

切角效果主要是通过gradient效果来实现，设置好各个渐变的位置，大小和颜色，镂空的地方颜色设置为transparent。

当然`linear-gradient`效果可通过`clip-path`实现，只不过后者的兼容性目前还不是很好(clip-path目前只在firefox54版本以上才可以使用)。

`radial-gradient`与`linear-gradient`不同，他是径向渐变，所以可以用来制作与圆相关的效果，比如如下。

```css
<style>
    .card {
        width: 200px;
        height: 120px;
        background-image: radial-gradient(circle at 100px -8px, transparent 20px, #b4a078 21px);
    }
</style>
```
<style>
    .card-div {
        width: 200px;
        height: 120px;
        margin: 30px auto;
        padding: 40px 20px;
        background-image: radial-gradient(circle at 100px -8px, transparent 20px, #b4a078 21px);
    }
</style>
<div class="card-div">You can write on it!</div>



### 饼图及其动画

```css
使用普通的css
<style>
    #pie-chart-css {
      width: 300px;
      height: 300px;
      margin: 200px auto;
      position: relative;
      border-radius: 50%;
      background: yellowgreen;
      background-image: linear-gradient(to right, transparent 50%, #655 0);
    }

    #pie-chart-css::before {
      background-color: inherit;
      content: '';
      display: block;
      margin-left: 50%;
      height: 100%;
      border-radius: 0 100% 100% 0/ 50%;
      transform-origin: left;
      animation: spin 5s linear infinite,
      bg 10s step-end infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(180deg);
      }
    }

    @keyframes bg {
      50% {
        background: #655;
      }
    }
</style>
```

这里要好好理解一下step-end的含义：
1. step-start在变化过程中，都是以下一帧的显示效果来填充间隔动画
2. step-end与上面相反，都是以上一帧的显示效果来填充间隔动画

所以在这里，0%~50%都是伪元素的背景都是`yellowgreen`，但是50%~100%开始才变成`#655`，step-start就刚好相反。



```css
使用svg的stroke-dasharray。
<style>
    #pie-chart-svg {
      display: block;
      width: 300px;
      height: 300px;
      margin: 200px auto;
      background: #E8E2D6;
      border-radius: 50%;
      transform: rotate(-90deg);
    }

    #pie-chart-circle {
      fill: #E8E2D6;
      // svg中stroke-width是沿着边缘中心向内向外的宽度，所以实际上向内的宽度只有stroke-width的一半。所以这里是32不是16。
      stroke-width: 32px;
      // 这里需要好好理解stroke-dasharray的含义！
      stroke-dasharray: 0 100;
      stroke: #b4a078;
      animation: pie-chart 5s forwards infinite linear;
    }

    @keyframes pie-chart {
      to { stroke-dasharray: 100 100; }
    }
</style>
```
<style>
    #pie-chart-svg {
      display: block;
      width: 300px;
      height: 300px;
      margin: 50px auto;
      background: #E8E2D6;
      border-radius: 50%;
      transform: rotate(-90deg);
    }

    #pie-chart-circle {
      fill: #E8E2D6;
      stroke-width: 32px;
      stroke-dasharray: 0 100;
      stroke: #b4a078;
      animation: pie-chart 8s forwards infinite linear;
    }

    @keyframes pie-chart {
      to { stroke-dasharray: 100 100; }
    }
</style>

<svg viewBox="0 0 32 32" id="pie-chart-svg">
    <circle cx="16" cy="16" r="16" id="pie-chart-circle"></circle>  
</svg>


### 五边形左右底脚的圆弧

<p><img src="/public/tech/css-magic/css-border-radius.jpg"></p>

关于这个图片中左下和右下的两个角的弧度，具体的实现办法是添加before和after伪类，设计成平行四边形分布在两边，然后再应用border-radius。

```css
<style>
  .container {
    margin: 300px;
    display: inline-block;
    width: 200px;
    height: 240px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    position: relative;
    cursor: pointer;
    font-size: 12px;
    overflow: hidden;
  }

  .container::before {
    transform: skewY(-30deg);
    transform-origin: left bottom;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: red;
    border-radius: 3px;
    position: absolute;
    top: 0;
    z-index: -1;
  }

  .container::after {
    transform: skewY(30deg);
    transform-origin: right bottom;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: red;
    border-radius: 3px;
    position: absolute;
    top: 0;
    z-index: -1;
  }
</style>
```

## 视觉效果

### 遮罩的实现

一般实现遮罩都是通过另一个背景div实现的，但是其实可以通过box-shadow实现。

```css
<style>
  .shade {
    box-shadow: 0 0 0 20px rgba(0, 0, 0, .8);
  }
</style>
```

<style>
  .shade {
    width: 300px;
    height: 100px;
    margin: 30px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 0 20px rgba(0, 0, 0, .8);
  }
</style>

<div class="shade">You can see me!</div>



## 结构与布局

### 绝对底部

之前自己实现的绝对底部是在父元素上padding一定距离，然后设置relative，footer设置absolute置底展示。不过这还可以通过cale()这个函数实现。

```css
<style>
  .toBottom {
    min-height: calc(100% - 100px);
    // 不过他获取的100%是父元素的height，所以当页面的总height小于窗口height的时候会失效，这个时候就需要让父元素获取到整个窗口的height。
  }
</style>
```


## 过渡与动画

### 走马灯效果

使用的是svg的stroke-dasharray和stroke-dashoffset的应用。

首先使用stroke-dasharray创建出间隔边框，然后再使用stroke-dashoffset推延起始位置。但是这个有个关键是，stroke-dashoffset必须是stroke-dasharray数值的偶数倍，不然就会出现瞬移。

```css
<style>
    #strokedrect-svg {
        margin: 30px auto;
        display: block;
        width: 600px;
        height: 200px;
    }

    #strokedrect {
      stroke: hsl(260, 50%, 90%);
      fill: white;
      stroke-width: 7;
      stroke-dasharray: 10;
      animation: marchingants 1s forwards infinite linear;
    }

    @keyframes marchingants {
      to { stroke-dashoffset: 20; }
    }
</style>
```

<style>
    #strokedrect-svg {
        margin: 30px auto;
        display: block;
        width: 600px;
        height: 200px;
    }

    #strokedrect {
      stroke: hsl(260, 50%, 90%);
      fill: white;
      stroke-width: 7;
      stroke-dasharray: 10;
      animation: marchingants 1s forwards infinite linear;
    }

    @keyframes marchingants {
      to { stroke-dashoffset: 20; }
    }
</style>

<svg viewBox="0 0 300 100" id="strokedrect-svg">
    <rect id="strokedrect" x="0" y="0" width="300" height="100" />
</svg>


### 打字效果

依靠animation的steps实现。

```css
<style>
  .typing-div {
    background: #fff;
    padding: 10px;
  }

  .typing {
    display: inline-block;
    width: 16ch;
    background: #fff;
    font: bold 200% Consolas, Monaco, monospace;   /*等宽字体*/
    overflow: hidden;
    white-space: nowrap;
    font-weight: 500;
    color: black;
    border-right: 1px solid transparent;
    // 注意这里的steps针对的是每2帧，并不是整个动画！
    animation: typing 8s steps(16) infinite, caret 0.5s steps(1) infinite;
  }
  
  @keyframes typing{
    from {
      width: 0;
    }
  }

  @keyframes caret {
    50% {
      border-color: currentColor;
    }
  }
</style>
```

<style>
  .typing-div {
    background: #fff;
    padding: 10px;
  }

  .typing {
    display: inline-block;
    width: 16ch;
    background: #fff;
    font: bold 200% Consolas, Monaco, monospace;   /*等宽字体*/
    overflow: hidden;
    white-space: nowrap;
    font-weight: 500;
    color: black;
    border-right: 1px solid transparent;
    animation: typing 8s steps(16) infinite, caret 0.5s steps(1) infinite;
  }
  @keyframes typing{
    from {
      width: 0;
    }
  }
  @keyframes caret {
    50% {
      border-color: currentColor;
    }
  }
</style>

<div class="typing-div">
  <span class="typing">You-can-see-me!</span>
</div>


### 抖动效果

抖动效果主要还是依靠animation完成，只不过需要比较多的状态。

```css
<style>
  .shake-div {
    background: #b4a078;
    margin: 30px auto;
    color: white;
    margin: auto;
    width: 180px;
    padding: .3em 1em .5em;
    border-radius: 3px;
    box-shadow: 0 0 .5em #b4a078;
    animation: shake-animation 1s ease infinite;
  }

  @keyframes shake-baidu {
    from    { transform: rotate(0deg); }
    4%      { transform: rotate(5deg); }
    12.5%   { transform: rotate(-5deg); }
    21%     { transform: rotate(5deg); }
    29%     { transform: rotate(-5deg); }
    37.5%   { transform: rotate(5deg); }
    46%     { transform: rotate(-5deg); }
    50%,to  { transform: rotate(0deg); }
  }
</style>
```
<style>
  .shake-div {
    background: #b4a078;
    margin: 30px auto;
    color: white;
    margin: auto;
    width: 180px;
    padding: .3em 1em .5em;
    border-radius: 3px;
    box-shadow: 0 0 .5em #b4a078;
    animation: shake-animation 1s ease infinite;
  }

  @keyframes shake-animation {
    from    { transform: rotate(0deg); }
    4%      { transform: rotate(5deg); }
    12.5%   { transform: rotate(-5deg); }
    21%     { transform: rotate(5deg); }
    29%     { transform: rotate(-5deg); }
    37.5%   { transform: rotate(5deg); }
    46%     { transform: rotate(-5deg); }
    50%,to  { transform: rotate(0deg); }
  }
</style>

<div class='shake-div'>You can see me!</div>








## 结尾

> ### 参考资料：
> * css揭秘
