---
layout: post
title: Weex 学习笔记以及踩坑记录
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

`:class="[exp?'class1': 'class2']"`


### refresh样式

refresh在ios测试时，如果下拉的距离超过了viewHeight，那么会执行刷新操作，但是多拉出的距离的背景是白色的，和网页demo是不一样，网页demo下拉的背景都是refresh设置的背景颜色。

### 不能使用组合选择器

如果要使用可查阅别的资料，下载node-sass,sass-loader，然后在weex-css-loader中添加配置。
但是因为不能使用组合选择器，所以我觉得sass的用处也不是很大。

---

## 与web的差异

### 不能在div中写文本，文本只能写在text中

这点非常重要，好几次都是因为这个导致显示对问题。

而且text是不会继承div对css的。

虽然div中也可以绑定值，但是div中的值是不会变化的。

```html
<div>{{a}}</div>

虽然a的值变化了，但是页面是不会变化的。

<text>{{a}}</text>
这样页面才会变化。
```

在使用text-overflow的时候发现文本始终处于ellipsis的状态，感觉代码写的也没有问题，后来发现weex会把`<text></text>`内打空间全部计算进去，如果标签内你换行了，他就会替换成空格占用空间。但是在web中是不会有这个问题的，应该是和`white-space`有关。

### image

不能使用img，使用image，而且要手动闭合，所有的image要设置width和height。

---

### input

如果ios不想要显示done那一栏，可以设置:hideDoneButton="true"。

官方文档中没有写，但是是有这个方法的。

在使用input的过程中发现，唤起键盘后总是会紧贴input下沿，暂时不知道如何解决。  
[提了一个issue](https://github.com/apache/incubator-weex/issues/1745)，暂时闲这样，以后自己学习OC的时候再尝试自己解决解决，感觉也不是什么难事～

---

## scroller, list， recycle-list

使用scroller的时候一定要设置相对应的宽度或者高度。

scroller和list不能相互嵌套相同方向的list和scroller，切记！

recycle-list中也不能嵌套相同方向的list和scroller，不能使用refresh。

recycle-list在渲染过程中会出现一些问题，已经提issue。

如果要设置全盘的滚动，因为内置的list，scroller必须要设置高度，除了根结点他会自动计算，所以这个时候最好的办法就是使用flex自动计算高度，但是前提是他的父元素是有设置高度的，不然就不会生效，所以这个时候需要给父元素也设置flex。

[dotwe example](http://dotwe.org/vue/9fa9d2f489d1988f7334aeabcae802df)

[github issue](https://github.com/apache/incubator-weex/issues/1629)

---

## refresh的问题

在使用refresh的时候，如果页面元素数量发生变化，页面会上移一段距离。

哇，好鸡儿坑哦。！！！！已经提了issue。

[github issue](https://github.com/apache/incubator-weex/issues/1633)

---

## 底部设置footer的问题

[dotwe example](http://dotwe.org/vue/ab28e101498e78b1730251a727838c5f)
在iOS，iphonexs上，如果设置了border-top，那么在页面滑动的时候footer底部会有1px的空间来显示`<recycle-list></recycle-list>`里点内容，我猜想是因为设置了border-top的时候默认也设置了相同宽度对border-bottom，但是我们并没有设置border-bottom对属性，所以会显示下个层级对内容。

可以采取的办法是：设置相同宽度对border-bottom，并且color为transparent；


---
## cell
```html
由于 <cell> 本身是一个容器，其布局由 <list> 进行管理，你不能给 <cell> 设定flex值。 <cell>的宽度等于父组件 <list> 的宽度，并且 <cell> 高度自适应，指定 margin 样式也不起作用。

所以不能给cell设定margin，虽然在web端生效，但是在移动端是不生效的。
```

---

## 使用dom的ref的时候

第一次用的时候app直接崩溃了，原因是调用`this.$refs.dom`返回的是一个数组，但是你要的单独的那个节点，所以你还这样使用`this.$refs.dom[0]`


---

## 下拉列表

在写下拉列表的时候要注意几个问题：
1. 因为weex没有z-index和display，所以当你使用opacity的时候会发现你把下拉列表放到dom最下面的时候会覆盖下拉列表下面内容的点击事件。
2. 如果上面是下拉列表，下面是textarea输入框的话，要实现带transition的功能，而且不覆盖textarea的点击，有两种写法。

第一种使用opacoty，但是定位top要定位可见区域外，并且要控制transition-timing-function，不能匀速，进入时先快后慢，这样才能让人感觉像是比较舒服的过渡。

第二种使用v-if，这样就不需要控制top等定位的位置，但是需要注意的必须要等到元素渲染了再执行过渡效果。所以这里就需要2个变量来控制节点的展示。第一个变量控制v-if的展示，第二个变量控制过渡的展示。进入的时候可以用nextTick，退出的时候可以使用setTimtout。具体实现可以看下面代码：


```html
<div v-if="isExpand"
    :class="['select', isSelectExist?'expandSelectCss':'']">
    <text v-for="item in typeList"
          :key="item"
          @click="choosenType(item)"
          class="option">{{ item }}</text>
</div>
```

```js
data() {
    return {
        isExpand: false,
        isSelectExist: false
    };
},

emitClick() {
    if (this.isExpand) {
    this.isSelectExist = false
        setTimeout(() => {
            this.isExpand = false
        }, 300);
    } else {
        this.isExpand = true
        this.$nextTick(() => {
            this.isSelectExist = true
        })
    }
},
choosenType(item) {
    this.isSelectExist = false
    setTimeout(() => {
        this.isExpand = false
    }, 300);
}


# 这里setTimtout控制为300ms是因为我的过渡效果的duration为300ms。
```

---
## 实现collapse

实现这个只需要v-if，但是要做动效发现很难，主要是无法获取隐藏文本的高度，想做这个效果也是可以的，就是很麻烦。

1. 与下拉列表一样，设置两个变量。
2. 在v-if生成dom节点的时候先获取文本的高度并保存，但是此时opacity为0，然后设置height为0和opacity为1，然后再调用animation使height变成之前保存的height。
3. 这个方案有个问题就是，在你保存高度的时候页面会闪烁，因为你虽然opacity为0，但是她还是占用了高度，然后你又让height瞬间为0，所以体验比较差。
4. 我去很多app中看了下，发现也基本没有collapse。想必也应该是体验并不是好。

---

## WeexPlayground

常常代码改动后等重新打完包再在手机中刷新，不然就报错，如果报错了就重新保存下。


## weex-ui

他的部分Utils还是很好用的。
注意getPageHeight和getScreenHeight区别。前面减去了顶部的导航栏的高度，后者则是整个屏幕的高度。




## OVER

用了一段时间，虽然坑是有的，但是表示可以理解，毕竟这便是使用js制作原生app的困难之处，而且我觉得很多坑用自己的知识也是可以解释的，所以不至于放弃～～