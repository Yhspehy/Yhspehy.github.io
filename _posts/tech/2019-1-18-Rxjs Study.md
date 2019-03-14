---
layout: post
title: Rxjs Study
tag: 技术
keywords: Rxjs
---



# Rxjs 学习笔记

关于 Rxjs，官网上到一句话解释到特别好，`可以把 RxJS 当做是用来处理事件的 Lodash`。她就是将我们处理事件到操作简化并且可控。

## Observable

Observable 是可观察对象，也就是我们需要监听到对象，每次这个对象返回值到时候，可以被我们订阅到观察者监听到。

## Observe

Observe 也就是观察者，监听到 Observable 的返回值后，针对返回值做处理。

## Subscription

Subscription 是订阅活动，一个可观察对象可以被观察者订阅。

## 简单的概括

可观察对象就像学校里的学生，观察者就像老师，学生只要去上学了，就会被老师审查（订阅），然后老师针对你的表现会有一系列的应对办法(观察者中的函数)。

## Observe 和 Subscription 的区别

官网上说： RxJS Subject 是一种特殊类型的 Observable，它允许将值多播给多个观察者，所以 Subject 是多播的，而普通的 Observables 是单播的(每个已订阅的观察者都拥有 Observable 的独立执行)。

初看这句话，其实是不好理解的，但是我只要举 2 个例子就可以很明显的解释它们俩之间的区别。

首先是 observe：

```js
var observable = Rx.Observable.create(function(source) {
  source.next(Math.random());
});

observable.subscribe(v => console.log("consumer A: " + v));
observable.subscribe(v => console.log("consumer B: " + v));

/* Prints DIFFERENT values for both consumers */
// consumer A: 0.25707833297857885
// consumer B: 0.8304769607422662
```

其次是 Subject：

```js
var observable = Rx.Observable.create(function(source) {
  source.next(Math.random());
});

var subject = new Rx.Subject();

subject.subscribe(v => console.log("consumer A: " + v));
subject.subscribe(v => console.log("consumer B: " + v));

observable.subscribe(subject);

/* Prints SAME values for both consumers */
// consumer A: 0.8495447073368834
// consumer B: 0.8495447073368834
```

看了这两个例子后其实就很好理解了，observable 的订阅者是单独的个体，每次接收到的值都是单独计算的。但是 Subject 的订阅者们，每次接收到的值都是相同的。
