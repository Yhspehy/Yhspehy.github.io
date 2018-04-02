---
layout: post
title: 依靠鼠标动态移动的div
tag: 技术
keywords: transform
---

之前看过很多网站首页，当你把鼠标放上去的时候，背景会跟着你的鼠标旋转倾斜，那个时候就觉得这个特效好牛逼，不过那时候的自己功力不够便没有深入了解。最近偶得空闲，便想起来想写一个。刚开始写参考的是[w3cplus这篇博客](https://www.w3cplus.com/css/animate-a-container-on-mouse-over-using-perspective-and-transform.html)。

## 代码

```css
<style>
  body, html {
    height: 100%;
    --mouseX: 0deg;  // css自定义属性
    --mouseY: 0deg;
    --bg: red;
  }

  #container {
    width: 300px;
    height: 300px;
    margin: 100px auto;
    padding: 50px;
    perspective: 30px;
    perspective-origin: center;
    background-color: #ffffff;
  }

  #inner {
    transform: rotateX(calc(var(--mouseY))) rotateY(calc(var(--mouseX)));
    transform-origin: center;
    transition: transform 0.5s;
    box-shadow: 2px 2px 50px rgba(0, 0, 0, 0.2);
    background: var(--bg);
    width: 100%;
    height: 100%;
  }
</style>
```

```js
<sctipt>
  (function () {
    var container = document.getElementById('container');

    var inner = document.getElementById('inner');
    
    // 避免移动一次回流一次，提高性能
    var i = 0;
    var limit = 10;
    function isLimit () {
      return ++i && i%limit === 0
    }
    
    // 计算鼠标与元素中点的距离
    function update (xPos, yPos) {
      // 获取元素中点相对于浏览器左上角的位置
      var wc = container.getBoundingClientRect().left + 150,
          hc = container.getBoundingClientRect().top + 150;
      inner.style.setProperty('--mouseX', -(xPos - wc) / 50 + 'deg');
      inner.style.setProperty('--mouseY', (yPos - hc) / 50 + 'deg');
    }

    function enter (event) {
      update(event.clientX, event.clientY);
    }

    function move (event) {
      if (isLimit()) {
        update(event.clientX, event.clientY);
      }
    }

    function touch (event) {
      event.preventDefault();
      var touch = event.targetTouches[0];
      if (touch) { 
        update(touch.pageX, touch.pageY); 
      }
    }

    function leave (event) {
      inner.style = '';
    }

    container.onmouseover = enter;
    container.onmousemove = move;
    container.ontouchmove = touch;
    container.onmouseleave = leave;

  })()
</script>
```


<style>
  body, html {
    height: 100%;
    --mouseX: 0deg;
    --mouseY: 0deg;
    --bg: red;
  }


  #container {
    width: 300px;
    height: 300px;
    margin: 100px auto;
    padding: 50px;
    perspective: 30px;
    perspective-origin: center;
    background-color: #ffffff;
  }

  #inner {
    transform: rotateX(calc(var(--mouseY))) rotateY(calc(var(--mouseX)));
    transform-origin: center;
    transition: transform 0.5s;
    box-shadow: 2px 2px 50px rgba(0, 0, 0, 0.2);
    background: var(--bg);
    width: 100%;
    height: 100%;
  }
</style>


<div id="container">
  <div id="inner"></div>
</div>

<script>
  (function () {
    var container = document.getElementById('container');

    var inner = document.getElementById('inner');

    var i = 0;
    var limit = 10;
    function isLimit () {
      return ++i && i%limit === 0
    }

    function update (xPos, yPos) {
      var wc = container.getBoundingClientRect().left + 150,
          hc = container.getBoundingClientRect().top + 150;
      inner.style.setProperty('--mouseX', -(xPos - wc) / 50 + 'deg');
      inner.style.setProperty('--mouseY', (yPos - hc) / 50 + 'deg');
    }

    function enter (event) {
      update(event.clientX, event.clientY);
    }

    function move (event) {
      if (isLimit()) {
        update(event.clientX, event.clientY);
      }
    }

    function touch (event) {
      event.preventDefault();
      var touch = event.targetTouches[0];
      if (touch) { 
        update(touch.pageX, touch.pageY); 
      }
    }

    function leave (event) {
      inner.style = '';
    }

    container.onmouseover = enter;
    container.onmousemove = move;
    container.ontouchmove = touch;
    container.onmouseleave = leave;

  })()
</script>



## 结论

通过这个demo， 我学到了如下：
1. css自定义属性
2. 使用`container.getBoundingClientRect()`来获取元素相对左上角的距离
3. `setProperty`来设置css的style的自定义属性