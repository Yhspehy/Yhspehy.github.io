---
layout: post
title: React-Native Study
tag: 技术
keywords: React-Native
---

# Expo

安装ios的Expo软件，并注册账号，然后即可在网页的expo中调试app中的页面，也不需要自动保存，还是很方便的。


# React Navigation

[doc](https://reactnavigation.org/docs/en/getting-started.html)

## 设置标题后退的图片

图片要设置在目标的页面中,并且只接受React Element或者Component,所以以前版本的直接require是会报错的。

```js
headerBackImage:(
    <Image
        style={{width: 30, height: 30 ,backgroundColor: '#f4511e'}} 
        source={require('./spiro.png')}
    />
),
```

## 设置后退文本

后退的文本要设置在原来页面中，比如你要从a页面跳到b页面，然后如果要在b页面中点击后退按钮返回a页面的话，那就要在a页面中设置b页面的后退文本。


## 使用全局的navigationOptions

使用这个的时候，注意只有在static navigationOptions的回调函数中才可以获得defaultNavigationOptions对象。在props中是拿不到的。



# 使用感受

使用了一天，感觉比weex好太多了呀～