---
layout: post
title: prototype和_proto_的理解
tag: 技术
keywords: prototype和_proto_
---

## 背景

<!-- 这几天闲着在浏览器查看各种属性，看到 prototype 和*proto*的时候，发现自己对他们的含义以及区别还是一知半解，遂翻阅高程和网上的一些讲解，归纳一下。 -->

## 含义

> 在高程中说：
>
> *   我们创建的每个函数都有一个 prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以右特定类型的所有实例共享的属性和方法。在默认情况下，所有的原型对象都会自动获得一个 constructor（构造函数）属性，这个属性是一个执行 prototype 属性所在函数的指针。
> *   创建了自定义的构造函数之后，其原型对象默认只会取得 constructor 属性；至于其他方法，则都是从 Object 继承而来的。当调用构造函数创建一个新实例后，该实例的内部将包括一个指针（内部属性），指向构造函数的原型对象[[prototype]]。但是在别的浏览器上都显示为*proto*。

总结一下这两段话：

1.  对象有属性**proto**,指向该对象的构造函数的原型对象。
2.  方法除了有属性**proto**,还有属性 prototype，prototype 指向该方法的原型对象

这里要注意的是，只有函数有这个原型对象，而对象是没有的（但是，js 里函数也是对象，不过函数是一个比较特殊的对象）。

## 思考

一看到函数有 prototype 属性，但是对象没有，相信不少人会有疑问，这不可能仅仅是定义的时候区别，肯定存在着某些联系。

所以我们来思考为什么对象中没有 prototype 属性。

我在 chrome 浏览器中打印`console.dir({})`  
结果如下：

```js
Object
  _proto_: (Object){
    constructor: f Object()
    .....
  }
```

发现 Object 原型对象的构造函数是`f Object()`，看到这里其实我们应该有一点头绪了，为什么普通的对象没有 prototype。

这是因为 prototype 是相对于构造函数的，这是构造函数和原型对象之间的互相指用，但是普通的对象是`f Object()`构造函数生成的对象了，所以他只有*proto*这个属性，指向构造函数的原型对象。

所以关于 prototype 和*proto*，我们首先要分清楚`{}, f Object(), Object`的区别(这里的 Objcet 就是 Object.prototype)。

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

`f Object()的`prototype 是 Object，毫无疑问,但是为什么他的*proto*变成 f()了呢？

首先`f Object()`的构造函数应该`f Function()`,而`f Function()`的原型对象就是`(f Function).prototype`，也就是这里的`f()`,在 chrome 中他统一删除了`.prototype`。
就像`(f Object()).prototype`显示为Object。

查看`f()`的属性我们就可以看到，他的 constructor 果然是`f Function()`，而他的原型对象则是 Object。这是因为函数本质也是对象，所以`Function.prototype`的原型对象是`Object.prototype`是理所当然的啦。

也许看到这里我们头会有点晕，这也是可以理解的，毕竟我们不能直接在实例的属性上查看构造函数是什么，但是我们可以通过*proto*的 constructor 查看他的构造函数。

---


### 一切皆对象

js里一切皆对象，谈谈这句话的理解？

虽然`'a'.length`为1，但是js明确指出了js的几种基本数据类型，其中复杂数据类型为object。

虽然浏览器`console.dir('a')`不会展示它的原型，但是`a.__proto__`还是可以看到的，但是也千万不要被它迷惑了。浏览器故意将它隐藏也正是这个原因。

虽然我们平常`var a = 'a'`经过了String的包装，但是a依然不是对象，他就是String。就比如，你穿女装但是不代表你是妹子！！！


---

### Object.create()

Object.create()的实现方式

```js
Object.create = function(o) {
    var F = function() {}
    F.prototype = o
    return new F()
}
```

这里可以看出他和 new 创建对象的区别。

new 创建的对象，对象的原型指向构造函数的原型对象。

但是 Object.create()创建的对象，他的原型指向传入的函数或者对象。

比如：

```js
var Base = function () {
    this.a = 2
}

Base.b = 3

Base.prototype.c = 4

var a = Object.create(Base);

在这里a的原型就是Base构造函数，而不是Base的原型，而且不会执行Base中的语句。所以

a.a   // undefined
a.b   // 3
a.c   // undefined

var b = new Base()    // 这里b的原型就是Base的原型对象，而且还会执行Base中的语句并将this指向b。

b.a   // 2
b.b   // undefined
b.c   // 4


所以SubType.prototype = Object.create(SuperType.prototype)相比SubType.prototype = new SuperType()的优势便是少调用了一次SuperType()。
```

js 中继承的是原型`_proto_`，而不是 prototype，千万要注意！！！

### babel 转码

在查看 babel 对于 class 的转码中，我看到`_inherits()`函数中执行了`if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;`,我有点不理解，之前都已经将 superClass 的 prototype 赋给了 subClass，为什么这里还要操作 subClass 的原型呢？而且我知道，当我们通过`new subClass()`之后，这个对象的`_proto_._proto`是指向 superClass.prototype 的，而上一句语句只是会修改`_proto_.constructor._proto_`的指向，而这个指向默认是 f()，所以我猜想，既然 subClass 继承了 superClass，那么为了一致性，除了让 subClass.prototype.constructor = subClass 之外，最好还是让`subClass._proto = superClass`。

## 总结

> 稍微的总结一下：
>
> *   prototype 始终是构造函数上的属性，它指向该方法的原型对象，`_proto_`指向该对象的构造函数的原型对象。
> *   普通对象上没有 prototype 属性是因为，普通对象是 f Object()构造函数生成的实例对象。
> *   如果要查看普通对象的构造函数，可以查看`_proto_`上的 constructor 属性。

最后附上一张从[知乎上扒下来的一张图](https://www.zhihu.com/question/34183746/answer/58068402)

<p><img src="/public/tech/prototype/line.jpg"></p>
