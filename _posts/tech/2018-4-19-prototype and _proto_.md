---
layout: post
title: prototype和_proto_的理解
tag: 技术
keywords: prototype和_proto_
---

## 背景

这几天闲着在浏览器查看各种属性，看到prototype和_proto_的时候，发现自己对他们的含义以及区别还是一知半解，遂翻阅高程和网上的一些讲解，归纳一下。



## 含义


> 在高程中说：
> * 我们创建的每个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以右特定类型的所有实例共享的属性和方法。在默认情况下，所有的原型对象都会自动获得一个constructor（构造函数）属性，这个属性是一个执行prototype属性所在函数的指针。
> * 创建了自定义的构造函数之后，其原型对象默认只会取得constructor属性；至于其他方法，则都是从Object继承而来的。当调用构造函数创建一个新实例后，该实例的内部将包括一个指针（内部属性），指向构造函数的原型对象[[prototype]]。但是在别的浏览器上都显示为_proto_。

总结一下这两段话：

1. 对象有属性__proto__,指向该对象的构造函数的原型对象。
2. 方法除了有属性__proto__,还有属性prototype，prototype指向该方法的原型对象

这里要注意的是，只有函数有这个原型对象，而对象是没有的（但是，js里函数也是对象，不过函数是一个比较特殊的对象）。

## 思考

一看到函数有prototype属性，但是对象没有，相信不少人会有疑问，这不可能仅仅是定义的时候区别，肯定存在着某些联系。

所以我们来思考为什么对象中没有prototype属性。

我在chrome浏览器中打印`console.dir({})`  
结果如下：
```js
Object
  _proto_: (Object){
    constructor: f Object()
    .....
  }
```

发现Object原型对象的构造函数是`f Object()`，看到这里其实我们应该有一点头绪了，为什么普通的对象没有prototype。

这是因为prototype是相对于构造函数的，这是构造函数和原型对象之间的互相指用，但是普通的对象是`f Object()`构造函数生成的对象了，所以他只有_proto_这个属性，指向构造函数的原型对象。

所以关于prototype和_proto_，我们首先要分清楚`{}, f Object(), Object`的区别(这里的Objcet就是Object.prototype)。

我们接着看`{}的属性，继续让下翻`

```js
Object
  _proto_: (Object){
    constructor: (f Object()) {
      prototype: Object,
      _proto_: f()
    }
  }
```

`f Object()的`prototype是Object，毫无疑问,但是为什么他的_proto_变成f()了呢？

首先`f Object()`的构造函数应该`f Function()`,而`f Function()`的原型对象就是`Function.prototype`，也就是这里的`f()`,在chrome中他统一删除了`.prototype`。

查看`f()`的属性我们就可以看到，他的constructor果然是`f Function()`，而他的原型对象则是Object。这是因为函数本质也是对象，所以`Function.prototype`的原型对象是`Object.prototype`是理所当然的啦。

也许看到这里我们头会有点晕，这也是可以理解的，毕竟我们不能直接在实例的属性上查看构造函数是什么，但是我们可以通过_proto_的constructor查看他的构造函数。



## 总结

> 稍微的总结一下：
> * prototype始终是函数上的属性，它指向该方法的原型对象，`_proto_`指向该对象的构造函数的原型对象。
> * 普通对象上没有prototype属性是因为，普通对象是f Object()构造函数生成的实例对象。
> * 如果要查看普通对象的构造函数，可以查看`_proto_`上的constructor属性。

最后附上一张从[知乎上扒下来的一张图](https://www.zhihu.com/question/34183746/answer/58068402)


<p><img src="/public/tech/prototype/line.jpg"></p>





