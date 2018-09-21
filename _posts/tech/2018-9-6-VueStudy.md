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




# 组件

因为vue组件是通过Vue.extend生成的，然后调用new component().$mount()挂载。其中new component()中使用initInternalComponent来初始化组件。

和new Vue的区别就是，vue组件产生的时候mergeOptions是不带vm的。

在Vue.extend中，会返回一个VueComponent构造函数，他会执行mergeOptions, 他的prototype是Super的prototype，即父类的prototype。可以在构造函数的super上访问到该父类。
Vue.extend的组件的Super就是Vue。VueExtendComponent.extend的组件的Super就是VueExtendComponent。




# 生命周期

所有的生命周期都会和父类合并，而且最终各个生命周期都会被加工成数组。所以如果你在模版中把生命周期写成数组形式也是可以的。

## init



# options.js

合并所有的参数。

其中props，injects, directives 都会合并，并且都会被合并成数组形式。
为什么我们能直接在template中使用keep-alive, transition, transition-group是因为Vue.options.components中包含了这三个组件并且合并到了组件上。  
而且keep-alive是抽象组件。在子组件寻找父组件的时候，是会略过抽象组件的。



# watch

被合并处理后的 watch 选项下的每个键值，有可能是一个数组，也有可能是一个函数。如果父选项(parentVal)也存在该字段的watch时才会是数组，不然就是函数。


# Vue.prototype._init

## initState以及Observe

在initData中，判断data中所有的字段是否符合规则，最后用observe(data)来创建监听对象。

1. observe首先会判断value是否为数组或者对象，并且不是虚拟dom，否则直接return。接着查询value自身是否有__ob__属性，没有则创建一个，并new Observe对象赋值给__ob__。
2. 接着它会判断value是数组还是对象，如果是数组，则判断能否使用对象的__proto__属性，如果能用就直接将原型上数组的方法赋给value的原型，否则将原型上数组的方法依次object.defineProperty到value上。然后执行observeArray，遍历数组的元素并observe(元素)(返回第一步)。
3. 如果是对象，则遍历属性并执行defineReactive。这一步就是响应式监听比较关键第一步，即将所有的属性设置get，set函数，当有节点访问这个参数并且存在dep.target的时候并自动将dep绑定到当前的watcher上，如果watcher上已有该dep则会跳过。当属性值改变时，出发dep.notify(),一次调用subs中watcher的update()。
4. 如果该属性值是数组或者对象的话则看下面。
5. 

```js
get: function reactiveGetter () {
    const value = getter ? getter.call(obj) : val
    if (Dep.target) {
        dep.depend()
        // 这里开始
        if (childOb) {
            childOb.dep.depend()
            if (Array.isArray(value)) {
                dependArray(value)
            }
        }
        // 结束
    }
    return value
}

```

如果你能理解上述代码中注释开始到结束的代码就说明你已经差不多理解了Vue中很关键的响应式原理。我们都知道我们直接添加删除对象属性，或者设置数组元素是不能响应式的，其原因就是Vue并没有收到该对象或者数组修改的情况反馈。  
我们现在知道dep.depend()在对象自身dep上，但是有个问题，如果对象下的某个属性也是对象了，并且那个属性对象新增了属性，那我该怎么监听呢？


```js
data: {
    a: {
        b: 1
    }
}
```
如果直接data.a.b = 2，那么vue可以直接响应，因为我们给data.a.b的dep上添加了watcher。
但是如果此时data.a.c = 1， 修改是data.a，但是我们并没有给data.a添加任何watcher，所以我们监听不了。

但是我们只需要childOb.dep.depend()就可以将对象下的__ob__添加watcher。只要该对象改变，则会通知绑定在在data.a上的watcher。

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

如果没有那段代码，因为我们知道对象会自动给childOb添加依赖，所有对象a的childOb就是__ob1__,但是这个时候Vue.set(this.a[0], 'd', 1)改变的话我们发现页面并没有改变。所以上述代码就是往数组中的所有元素添加依赖，使得他们改变的时候能够通知到相关watcher。

但是有个问题就是如果我想往data上设置属性呢？我们发现是不行的，因为他对data里的数据做了代理，然后this上并没有data属性，所以我们要往_data上设置，但是这个时候Vue就会报错，就是这段Vue.set代码中的那段warn。这是为什么呢？因为data并不是响应式数据，如果一个对象是响应式数据，那么他的__ob__肯定是dep.depend()了，但是data这个数据其实并没有执行dep.depend()的。所以她不是响应式数据，从而也不能通过set往data上设置属性。并且如果你使用原本不在data上的属性的时候，vue在compile的时候也是会报错的。


## $mount

1. 调用Vue.prototype._init里的vm.$mount
2. 执行web平台重写的$mount函数，将template函数转成render函数
3. 执行runtime下的$mount函数，执行mountComponent()
4. 执行vm._update(vm._render(), hydrating)
5. vm._render 函数的作用是调用 vm.$options.render 函数并返回生成的虚拟节点(vnode)
6. vm._update 函数的作用是把 vm._render 函数生成的虚拟节点渲染成真正的 DOM


## initWatch和$watcher,Watcher

在watcher的get中，他会pushTarget(this)，意味着初始化watcher或者每次update()时候,Dep.target就是当前的watcher，所以只要你取值，就会执行dep.depend()来添加依赖。  
所以每次watch data上的数据的时候，因为初始化便会获取data里的值，所以在init watch的时候便会将data的属性值的dep绑定到当前的watcher上。

而模版中的数据则会在renderWatcher中被绑定。


在数据发生变化的时候该如何更新呢？
1. 首先修改的数据会依次执行数据所依赖的dep.sub中watcher的update()
2. 在watcher的update中，会根据computed，sync，和其他情况分成三类，其中第三类是会执行queueWatcher()
3. queueWatcher会筛选watcher(重复的watcher不会被再次推入queue，因为最后执行flushSchedulerQueue的时候，会获取watcher最后的数据value)，并且将watcher推入queue中，并在第一次获取到watcher的时候执行nextTick(flushSchedulerQueue)，这个函数是用来一次性处理所有queue中的watcher，并按照watcherId从小到达排序，因为组件的watch是先与renderWatcher的，所以可以将所有watcher的数据修改完成后一次性调用render渲染函数，不需要数据修改一次就调用一次render函数，提高了性能。
4. 在nextTick(flushSchedulerQueue)后，nextTick里的callback就生成了一个micortask队列，在调用栈清空后就会执行microtask里的任务。


> 我认为Vue中最美的实现便是这里，在所有的数据上添加依赖数组，修改则告知所有的wahcter，然后在一个macrotask中将所有的要执行的watcher添加进一个数组并在microtask中一次执行，最后执行renderwatcher，再microtask执行完后浏览器UI进行渲染。真的简直完美！




## initProps

在initProps中的toggleObserving的理解：因为props传递给子组件的是父组件的值，所以如果传递的是一个数组或者对象，则这个值本身就是响应式数据，并且它的__ob__包含了父组件的renderWatcher。而具体所应用的属性的dep则包含真正应用这个数据的renderWatcher，因为当子组件的renderWatcher执行的时候，会调用相应props对象的属性值，并且将子组件的renderWatcher添加到subs里。  
所以这里不需要重复observe childOb。而defineReactive本身是因为可以将当前的renderWatcher添加到它的__ob__中，所以这个时候props[key].__ob__的subs就包含了子组件和父组件的renderWatcher。当本身值改变的时候可以触发子组件的rederWatcher。比如`w:{a: 1}`上要添加属性c的时候，如果没有子组件的将renderWatcher添加进w.__ob__的dep.subs就不会触发更新了。


可以试试将initProps中defineReactive注释掉，改成`props[key] = value`。你就会发现他不会自定更新了，因为没有触发子组件的renderWatcher。


理解对象的__ob__和每个属性独自的dep很重要！！！


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





