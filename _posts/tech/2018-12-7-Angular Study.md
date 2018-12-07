---
layout: post
title: Angular Study
tag: 技术
keywords: Angular
---

因为要用RN重构Angular的项目，所以记录一下学习过程，虽然之前初略的看过一点Angular～


# NgModule

在学习Angular的时候，最困扰我的就是NgModule。虽然看了官网例子，但是还是觉得对这个一知半解，但是当我看这demo项目的结构的时候，我发现我顿悟了不少。

NgModule作为Angular中重要的一环，连接着整个项目的结构，将一个个组件组织在一起，形成一个个模块。然后所有的子模块被父模块所依赖（或懒加载），并最终被app.module.ts所依赖。

所以这么来看，理解NgModule就比较容易了，它里面所包含的参数也比较清楚。

注意几点：
1. 路由中所有依赖的组件都必须添加到NgModule中到declarations中，而懒加载到模块则不需要。
2. 根NgModule中import到模块是不可以在全局使用到，也还是只能在根NgModule中所依赖到模块中使用。