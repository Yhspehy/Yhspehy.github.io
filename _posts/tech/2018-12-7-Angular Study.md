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

所以这么来看，理解NgModule就比较容易了，它里面所包含的参数也比较清楚。·

注意几点：
1. 路由中所有依赖的组件都必须添加到NgModule中到declarations中，而懒加载到模块则不需要。
2. 根NgModule中import到模块是不可以在全局使用到，也还是只能在根NgModule中所依赖到模块中使用。

有了NgModule以后，感觉简便了很多步骤，因为在这个模块中所有的内容都包含在了NgModule中，所以你不需要再一个个去查找组件所引入的模块，可以直接在NgModule中一查便知，就像package.json相对于项目一样。这也就更容易维护开发了。

听很多人说Angular项目维护省心，而且代码结构比较一致，看了一些demo和项目之后发现确实是这样的，不过要求也更高一点，毕竟知道rxjs，ts和会熟练的使用是不一样的，这两个工具还是需要一点时间来学习踩坑的。毕竟有很多写Angular的人写ts的时候也只会使用一些类型判断，这其实还是差别很大的。

provider的理解：在组件中使用server之前，该server必须被依赖注入，只有依赖注入后，才能在组件中使用，但是你还是需要引入该server，这个组件引用不一样。组件你只要在NgModule中声明了，就不需要在ts中引入就可以直接使用，但是server还是需要引入的。
