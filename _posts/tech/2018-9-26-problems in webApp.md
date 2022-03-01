---
layout: post
title: vue开发webApp时所遇到的问题整理
tag: App
keywords: vue webApp
---

# 背景

因为新项目是基于 cordova 打包出来的 app，其实内部页面都是通过 webapp 实现，所以近期先将部分遇到的问题整理一下。

既然最后打包成 app，做为开发人员肯定想在动效实现上和原生相近，所以在我做的过程中发现了如下几个问题。

# 问题(坑)

## ios swiper left or right

在 safari 中页面可以通过左划来返回上一页，右划前往之前返回的下一页，这个功能在你没有使用 transition 的时候是完全没有问题的，但是原生 app 那么多有页面切换的过渡效果，我们肯定也不能少啊，所以在我使用 transition 后我发现一个问题，原生 app 中左划右划后是不是有动画的，道理也是很明显的，因为你左划右划的时候页面都是完全直接展示的，这个如果如果有动画就意味着页面会消失然后再出现，这个体验就不是很好了。

但是如果我们使用了 transition 后会出现上述的情况，那么我们怎么解决呢？

我们可以通过监听页面中的 touch 事件来判断当前页面是否会通过左划来返回上一页。

主要的想法就是记录左划的距离，如果这个距离超过了当前页面的一半宽度那么就会返回上一页，这个时候我们要关掉上一页的 transition 效果。

那么这里就有几个坑要解决了，首先设备判断左划这个操作需要一定的条件，你不可能手放上去划一点点页面就跟着滑动了，不然页面肯定很不稳定，因为一点点的触碰都会导致左划。其次如果关闭上一个的 transition。

```js
// 记录最开始的x坐标
let startX = -1;
// 储存vue实例，在左划结束的时候判断是否会返回上一页，同时将结果存储
// 然后在父组件中监听$route，每次路由变化的时候去获取那个值
// 从而判断是否执行transition效果
let vue = null;

export function SafariSlideLeftTwiceTransitionAddLis(vm) {
  if (!vue) vue = vm;
  document.addEventListener("touchstart", watchTouchStart);
  document.addEventListener("touchend", watchTouchEnd);
}

export function SafariSlideLeftTwiceTransitionRemoveLis() {
  document.removeEventListener("touchstart", watchTouchStart);
  document.removeEventListener("touchend", watchTouchEnd);
}

function watchTouchStart(e) {
  console.log("touchstart");
  // 首先要满足左划的第一个条件就是pageX在页面的34px以内，
  // 就是你touchstart的触电不能大于这个x，
  // 这个数据也是我测试多次得到的，可能不是最精确的。
  startX = e.pageX < 34 ? e.pageX : -1;
}

// 因为我只需要最后的点，所以不需要关心touchmove中的过程
function watchTouchEnd(e) {
  if (startX > -1 && e.pageX < 0) {
    console.log("touchend");
    const width = window.screen.width;
    // 满足左划的条件之二
    // 你只有先往左划了16px之后，浏览器才会认为你要通过左划返回上一页了
    // 同样数据可能不是最精确的。
    const dis = width + e.pageX - startX - 16;
    if (dis > width / 2) {
      vue.$store.commit("SET_TRANSITION", false);
    }
  }
}
```

然后你只要在相关页面导入这两个函数，并监听一下，记得在 beforeDestroy 中解除一下。然后在父组件中监听一下路由变化就可以实现这个功能了。

但是随之而来又出现了一个问题，那就是这个时候 safari 记住的是你上次离开这个页面时的状态，所以如果你是通过点击按钮来跳转下一页的话，这个时候你左划后那个页面会出现被点击的背景色，这也是个坑，但是你可以设置 a 标签`-webkit-tap-highlight-color: transparent;`来取消这个背景色，但是相对的你点击这个按钮的时候也没有背景色了。

## 评论功能

首先在开发前让我们来看看原生 app 上的评论功能是咋样的。

首先当你点击 input 输入框后，键盘弹起，背景有个灰色的遮罩，同时不能滚动页面，而且当前页面也不会滚动。看原生 app 的效果就觉得真的简单，啥都不用动就弹个键盘加层遮罩就完事了对不对。

现在让我们来看看浏览器里实现上述操作的时候会发现啥。

### 假设我们使用的是 fixed 固定底端的 input

首先出现的是 input 被遮挡问题，在每次切换 safari chrome 后第一次唤起会出现这个问题，之后都不会。  
其次每次唤起键盘页面都会上移，并且键盘去掉的时候页面不会上移回到之前的位置。

那么我们来解决这几个问题：

首先 input 被遮挡的问题主要是第一次点击的时候浏览器获取到的 window.innerHeight 比正常的大，导致 input 被遮挡，但是其实没过多少时间浏览器就会获取到正常大值，所以我们只需要在 input 的 click 事件中添加个 settimeout 事件，里面执行 scrollIntoView 即可，scrollIntoViewIfNeeded 可执行可不执行。

而第二个问题，页面上移我发现完全避免不了的，我能做的就是在关闭键盘后讲页面返回原来的位置。

```js
        let top = 0
        let bodyEl = document.querySelector('body');

        inputFocus(el) {
            if (this.disScroll) return;
            this.scrollY = window.scrollY;
            this.disScroll = true;

            top = window.scrollY;
            bodyEl.style.position = 'fixed';
            bodyEl.style.top = -top + 'px';

            setTimeout(() => {
                el.target.scrollIntoView(true);
                el.target.scrollIntoViewIfNeeded();
            }, 200);
        },
        inputBlur() {
            this.disScroll = false;
            bodyEl.style.position = '';
            bodyEl.style.top = '';
            window.scrollTo(0, top);
        }
```

这个方案也有个问题，那就是在 safari 下，input 和键盘之间会有一段空隙，这段空隙就是 safari toolbar 的高度。如果打包成 app 后应该是没有这个问题了，但是 web 调试的时候看起来很别扭。

### 使用 flex 布局将 input 置于底部

同样会出现 input 遮挡问题，页面会上移，但是键盘去掉后会下移回到之前的位置。  
中间内容块的滚动卡顿。

下面的问题解决方法：
遮挡问题还是通过上面那个方法，滚动卡顿可以通过设置`-webkit-overflow-scrolling: touch`。

但是如果你使用 settimeout，但是会出现键盘和 input 之间有空隙，不过你可以通过之前 fixed 固定 body 的方法来消除。

虽然在 iphone6s 会出现这些问题，但是我今天换了 iphonexs 后，这些问题都复现不了了！！

### 总结

最后我推荐使用第二种方法，因为我感觉兼容性比较好，而且使用 fixed 固定 body 后在 ios 下也不会出现键盘和 input 的空隙。  
但是第二种方法我发现会出现滚动穿透的问题。原生的 scroll 是真的坑啊（仅在 safari 下），这个穿透简直了！！！！

最后我用 better-scroll 来代替了原生的 scroll，就没有滚动穿透了。
