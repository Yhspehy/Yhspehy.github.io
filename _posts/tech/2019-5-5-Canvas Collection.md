---
layout: post
title: Canvas 收集
tag: 技术
keywords: Canvas
---

# Canvas 效果收集

## 颜色渐变

```js
const ctx = canvas.getContext("2d");
let frame;

(function loop() {
  frame = requestAnimationFrame(loop);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let p = 0; p < imageData.data.length; p += 4) {
    const i = p / 4;
    const x = i % canvas.width;
    const y = (i / canvas.height) >>> 0;

    const t = window.performance.now();

    const r = 64 + (128 * x) / canvas.width + 64 * Math.sin(t / 1000);
    const g = 64 + (128 * y) / canvas.height + 64 * Math.cos(t / 1000);
    const b = 128;

    imageData.data[p + 0] = r;
    imageData.data[p + 1] = g;
    imageData.data[p + 2] = b;
    imageData.data[p + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
})();
```

### 圆形水波进度球

```html
<style type="text/css">
  #c {
    margin: 0 auto;
    display: block;
  }
  #r {
    display: block;
    margin: 0 auto;
  }
  #r::before {
    color: black;
    content: attr(min);
    padding-right: 10px;
  }
  #r::after {
    color: black;
    content: attr(max);
    padding-left: 10px;
  }
</style>

<canvas id="c" width="250" height="250"></canvas>
<input type="range" id="r" min="0" max="100" step="1" />
```

```js
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");
var range = document.getElementById("r");

//range控件信息
var rangeValue = range.value;
var nowRange = 0; //用于做一个临时的range

//画布属性
var mW = (canvas.width = 250);
var mH = (canvas.height = 250);
var lineWidth = 2;

//圆属性
var r = mH / 2; //圆心
var cR = r - 16 * lineWidth; //圆半径

//Sin 曲线属性
var sX = 0;
var sY = mH / 2;
var axisLength = mW; //轴长
var waveWidth = 0.05; //波浪宽度,数越小越宽
var waveHeight = 6; //波浪高度,数越大越高
var speed = 0.09; //波浪速度，数越大速度越快
var xOffset = 0; //波浪x偏移量

ctx.lineWidth = lineWidth;

//画圈函数
var IsdrawCircled = false;
var drawCircle = function() {
  ctx.beginPath();
  ctx.strokeStyle = "#1080d0";
  ctx.arc(r, r, cR + 5, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(r, r, cR, 0, 2 * Math.PI);
  ctx.clip();
};

//画sin 曲线函数
var drawSin = function(xOffset) {
  ctx.save();

  var points = []; //用于存放绘制Sin曲线的点

  ctx.beginPath();
  //在整个轴长上取点
  for (var x = sX; x < sX + axisLength; x += 20 / axisLength) {
    //此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
    var y = -Math.sin((sX + x) * waveWidth + xOffset);

    var dY = mH * (1 - nowRange / 100);

    points.push([x, dY + y * waveHeight]);
    ctx.lineTo(x, dY + y * waveHeight);
  }

  //封闭路径
  ctx.lineTo(axisLength, mH);
  ctx.lineTo(sX, mH);
  ctx.lineTo(points[0][0], points[0][1]);
  ctx.fillStyle = "#1c86d1";
  ctx.fill();

  ctx.restore();
};

//写百分比文本函数
var drawText = function() {
  ctx.save();

  var size = 0.4 * cR;
  ctx.font = size + "px Microsoft Yahei";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(06, 85, 128, 0.8)";
  ctx.fillText(~~nowRange + "%", r, r + size / 2);

  ctx.restore();
};

var render = function() {
  ctx.clearRect(0, 0, mW, mH);

  rangeValue = range.value;

  if (IsdrawCircled == false) {
    drawCircle();
  }

  if (nowRange <= rangeValue) {
    var tmp = 1;
    nowRange += tmp;
  }

  if (nowRange > rangeValue) {
    var tmp = 1;
    nowRange -= tmp;
  }

  drawSin(xOffset);
  drawText();

  xOffset += speed;
  requestAnimationFrame(render);
};

render();
```
