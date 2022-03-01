---
layout: post
title: Vue 源码学习(2.5.17-beta.0)
tag: Vue
keywords: Vue
---

记录一下学习 Vue 源码的时候学习到的东西

# 大纲

1. 在 instance/index.js 中定义 Vue 的 init,state,render,events 等原型方法。
2. 然后在 core/index.js 中引入并加工 extend 各种 globalApi。
3. 接着在 web 或者 weex 平台下，不同的 entry 下引入 core/index.js，并根据不同的平台定义不同的\$mount 方法以及部分 platform specific utils。
4. 在使用的时候调用 new Vue()的时候调用的就是 instance/index.js 中的 init 方法。

# 组件

因为 vue 组件是通过 Vue.extend 生成的，然后调用 new component().\$mount()挂载。其中 new component()中使用 initInternalComponent 来初始化组件。

和 new Vue 的区别就是，vue 组件产生的时候 mergeOptions 是不带 vm 的。

在 Vue.extend 中，会返回一个 VueComponent 构造函数，他会执行 mergeOptions, 他的 prototype 是 Super 的 prototype，即父类的 prototype。可以在构造函数的 super 上访问到该父类。
Vue.extend 的组件的 Super 就是 Vue。VueExtendComponent.extend 的组件的 Super 就是 VueExtendComponent。

# 生命周期

所有的生命周期都会和父类合并，而且最终各个生命周期都会被加工成数组。所以如果你在模版中把生命周期写成数组形式也是可以的。

## init

# options.js

合并所有的参数。

其中 props，injects, directives 都会合并，并且都会被合并成数组形式。
为什么我们能直接在 template 中使用 keep-alive, transition, transition-group 是因为 Vue.options.components 中包含了这三个组件并且合并到了组件上。  
而且 keep-alive 是抽象组件。在子组件寻找父组件的时候，是会略过抽象组件的。

# watch

被合并处理后的 watch 选项下的每个键值，有可能是一个数组，也有可能是一个函数。如果父选项(parentVal)也存在该字段的 watch 时才会是数组，不然就是函数。

# Vue.prototype.init

## initState 以及 Observe

在 initData 中，判断 data 中所有的字段是否符合规则，最后用 observe(data)来创建监听对象。

1. observe 首先会判断 value 是否为数组或者对象，并且不是虚拟 dom，否则直接 return。接着查询 value 自身是否有`__ob__`属性，没有则创建一个，并 new Observe 对象赋值给`__ob__`。
2. 接着它会判断 value 是数组还是对象，如果是数组，则判断能否使用对象的`__proto__`属性，如果能用就直接将原型上数组的方法赋给 value 的原型，否则将原型上数组的方法依次 object.defineProperty 到 value 上。然后执行 observeArray，遍历数组的元素并 observe(元素)(返回第一步)。
3. 如果是对象，则遍历属性并执行 defineReactive。这一步就是响应式监听比较关键第一步，即将所有的属性设置 get，set 函数，当有节点访问这个参数并且存在 dep.target 的时候并自动将 dep 绑定到当前的 watcher 上，如果 watcher 上已有该 dep 则会跳过。当属性值改变时，出发 dep.notify(),一次调用 subs 中 watcher 的 update()。
4. 如果该属性值是数组或者对象的话则看下面。

5.

```js
get: function reactiveGetter() {
  const value = getter ? getter.call(obj) : val;
  if (Dep.target) {
    dep.depend();
    // 这里开始
    if (childOb) {
      childOb.dep.depend();
      if (Array.isArray(value)) {
        dependArray(value);
      }
    }
    // 结束
  }
  return value;
}
```

如果你能理解上述代码中注释开始到结束的代码就说明你已经差不多理解了 Vue 中很关键的响应式原理。我们都知道我们直接添加删除对象属性，或者设置数组元素是不能响应式的，其原因就是 Vue 并没有收到该对象或者数组修改的情况反馈。  
我们现在知道 dep.depend()在对象自身 dep 上，但是有个问题，如果对象下的某个属性也是对象了，并且那个属性对象新增了属性，那我该怎么监听呢？

```js
data: {
  a: {
    b: 1;
  }
}
```

如果直接 data.a.b = 2，那么 vue 可以直接响应，因为我们给 data.a.b 的 dep 上添加了 watcher。
但是如果此时 data.a.c = 1， 修改是 data.a，但是我们并没有给 data.a 添加任何 watcher，所以我们监听不了。

但是我们只需要 childOb.dep.depend()就可以将对象下的`__ob__`添加 watcher。只要该对象改变，则会通知绑定在在 data.a 上的 watcher。

```js
if (Array.isArray(value)) {
    dependArray(value)
}

data: {
    a: [
        {
            b: 1
        }
    ]
}

observe解析后为：
data: {
    __ob__: ...(依赖了),
    a: {
        __ob__: ...(依赖了，区别一下叫做__ob1__),
        0: {
            __ob__: ...(没有依赖,区分一下叫做__ob2__),
            b: 1
        }
    }

}
```

如果没有那段代码，因为我们知道对象会自动给 childOb 添加依赖，所有对象 a 的 childOb 就是`__ob1__`,但是这个时候 Vue.set(this.a[0], 'd', 1)改变的话我们发现页面并没有改变。所以上述代码就是往数组中的所有元素添加依赖，使得他们改变的时候能够通知到相关 watcher。

但是有个问题就是如果我想往 data 上设置属性呢？我们发现是不行的，因为他对 data 里的数据做了代理，然后 this 上并没有 data 属性，所以我们要往 data 上设置，但是这个时候 Vue 就会报错，就是这段 Vue.set 代码中的那段 warn。这是为什么呢？因为 data 并不是响应式数据，如果一个对象是响应式数据，那么他的`__ob__`肯定是 dep.depend()了，但是 data 这个数据其实并没有执行 dep.depend()的。所以她不是响应式数据，从而也不能通过 set 往 data 上设置属性。并且如果你使用原本不在 data 上的属性的时候，vue 在 compile 的时候也是会报错的。

## \$mount

1. 调用 Vue.prototype.init 里的 vm.\$mount
2. 执行 web 平台重写的\$mount 函数，将 template 函数转成 render 函数
3. 执行 runtime 下的\$mount 函数，执行 mountComponent()
4. 执行 vm.update(vm.render(), hydrating)
5. vm.render 函数的作用是调用 vm.\$options.render 函数并返回生成的虚拟节点(vnode)
6. vm.update 函数的作用是把 vm.render 函数生成的虚拟节点渲染成真正的 DOM

## initWatch 和\$watcher,Watcher

在 watcher 的 get 中，他会 pushTarget(this)，意味着初始化 watcher 或者每次 update()时候,Dep.target 就是当前的 watcher，所以只要你取值，就会执行 dep.depend()来添加依赖。  
所以每次 watch data 上的数据的时候，因为初始化便会获取 data 里的值，所以在 init watch 的时候便会将 data 的属性值的 dep 绑定到当前的 watcher 上。

而模版中的数据则会在 renderWatcher 中被绑定。

在数据发生变化的时候该如何更新呢？

1. 首先修改的数据会依次执行数据所依赖的 dep.sub 中 watcher 的 update()
2. 在 watcher 的 update 中，会根据 computed，sync，和其他情况分成三类，其中第三类是会执行 queueWatcher()
3. queueWatcher 会筛选 watcher(重复的 watcher 不会被再次推入 queue，因为最后执行 flushSchedulerQueue 的时候，会获取 watcher 最后的数据 value)，并且将 watcher 推入 queue 中，并在第一次获取到 watcher 的时候执行 nextTick(flushSchedulerQueue)，这个函数是用来一次性处理所有 queue 中的 watcher，并按照 watcherId 从小到大排序，因为组件的 watch 是先 renderWatcher 的，所以可以将所有 watcher 的数据修改完成后一次性调用 render 渲染函数，不需要数据修改一次就调用一次 render 函数，提高了性能。
4. 在 nextTick(flushSchedulerQueue)后，nextTick 里的 callback 就生成了一个 micortask 队列，在调用栈清空后就会执行 microtask 里的任务。

> 我认为 Vue 中最美的实现便是这里，在所有的数据上添加依赖数组，修改则告知所有的 watcher，然后在一个 macrotask 中将所有的要执行的 watcher 添加进一个数组并在 microtask 中一次执行，最后执行 renderwatcher，再 microtask 执行完后浏览器 UI 进行渲染。真的简直完美！

## initProps

在 initProps 中的 toggleObserving 的理解：因为 props 传递给子组件的是父组件的值，所以如果传递的是一个数组或者对象，则这个值本身就是响应式数据，并且它的`__ob__`包含了父组件的 renderWatcher。而具体所应用的属性的 dep 则包含真正应用这个数据的 renderWatcher，因为当子组件的 renderWatcher 执行的时候，会调用相应 props 对象的属性值，并且将子组件的 renderWatcher 添加到 subs 里。  
所以这里不需要重复 observe childOb。而 defineReactive 本身是因为可以将当前的 renderWatcher 添加到它的`__ob__`中，所以这个时候`props[key].__ob__`的 subs 就包含了子组件和父组件的 renderWatcher。当本身值改变的时候可以触发子组件的 rederWatcher。比如`w:{a: 1}`上要添加属性 c 的时候，如果没有子组件的将 renderWatcher 添加进`w.__ob__`的 dep.subs 就不会触发更新了。

可以试试将 initProps 中 defineReactive 注释掉，改成`props[key] = value`。你就会发现他不会自定更新了，因为没有触发子组件的 renderWatcher。

理解对象的`__ob__`和每个属性独自的 dep 很重要！！！

比如：

```js
// 父组件
<child :w="w"></child>

data => {
    w : {a: 1}
}

// 子组件
<div>{{w}}</div>

props: ['w']

// 最终w的__ob__
w: {
    __ob__: ...  // dep.subs里包含了父组件和子组件的renderWatcher，子组件的renderWatcher在initProps中defineReactive的时候添加。
    a: 1    // a元素单独的dep.subs里包含了子组件的renderWatcher，只包含应用a属性的组件renderWatcher
}
```

# AST

在阅读 html-parse 源码中，解析的流程如下：

1. 判断是否在 script 或 style 或 textarea 标签中

如果不在这三个标签中，则开始解析 html 代码。

正则匹配`<`开始的标签，如果匹配成功，则判断是否是普通注释，条件注释，Doctype 和结束标签并做相关处理。如果都不匹配，则说明是要么是匹配到了开始标签，要么就是文本内容。比如： `<div></div>`或则`内容<div></div>`。

如果匹配到了开始标签，则使用 parseStartTag 解析 html，并使用 handleStartTag 来处理获取的 match。

# Vue 存在的一些问题

1. @click 绑定的函数主体不明

我们都知道 vue 中的 click 绑定可以这么写：

```html
<div @click="handler"></div>

<div @click="handler()"></div>
```

但是如果这个 handler 是`handler => () => {}`的时候呢，上面这 2 中写法有啥区别呢，会不会执行不同的函数呢？

答案是：还是会执行第一层函数，即第二种写法还是会执行`handler`，并不是直接执行`() => {}`这个函数。

那么其实我们就不应该写`<div @click="handler()"></div>`对不对，会误导人，虽然`<div @click="handler()"></div>`会被编译成`<div @click="() => handler"></div>`，但是这终究还是 vue 解释的，在我们看来还是会不妥，这个问题就应该和 react 一样，一定要规范。

2. vuex 和 v-model 冲突

没啥好的解决办法，只能取的时候取获取 vuex 中的值，然后改变值的时候再调用 vuex 的 mutation。

本来想自己写一个指令来合并那两个操作，但是发现实现不了，因为指令中的 update 监听的是 el 的 vnode，而 vnode 的更新还是需要依靠文档的 input 指令，所以就是实现不了了。
