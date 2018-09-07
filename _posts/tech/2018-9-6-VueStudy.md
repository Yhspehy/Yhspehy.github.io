---
layout: post
title: Vue 源码学习(2.5.17-beta.0)
tag: 技术
keywords: Vue
---


记录一下学习Vue源码的时候学习到的东西


# 大纲

1. 在instance/index.js中定义Vue的init,state,render,events等原型方法。
2. 然后在core/index.js中引入并加工extend各种globalApi。
3. 接着在web或者weex平台下，不同的entry下引入core/index.js，并根据不同的平台定义不同的$mount方法以及部分platform specific utils。
4. 在使用的时候调用new Vue()的时候调用的就是instance/index.js中的init方法。
5. vue组件产生是通过vue.extend的，和new Vue的区别就是，vue组件产生的时候mergeOptions是不带vm的。




# 组件

因为vue组件是通过Vue.extend生成的，然后调用new component().$mount()挂载。

在Vue.extend中，会返回一个VueComponent构造函数，他的prototype是Super的prototype，即父类的prototype。可以在构造函数的super上访问到该父类。
Vue.extend的组件的Super就是Vue。VueExtendComponent.extend的组件的Super就是VueExtendComponent。


# 生命周期

所有的生命周期都会和父类合并，而且最终各个生命周期都会被加工成数组。


# options 

合并所有的参数。



# watch

被合并处理后的 watch 选项下的每个键值，有可能是一个数组，也有可能是一个函数