---
layout: post
title: React-Native Study
tag: 技术
keywords: React-Native
---

# React-Native Study

## Expo

安装 ios 的 Expo 软件，并注册账号，然后即可在网页的 expo 中调试 app 中的页面，也不需要自动保存，还是很方便的。

## React Navigation

[doc](https://reactnavigation.org/docs/en/getting-started.html)

## 设置标题后退的图片

图片要设置在目标的页面中,并且只接受 React Element 或者 Component,所以以前版本的直接 require 是会报错的。

```js
headerBackImage:(
    <Image
        style={{width: 30, height: 30 ,backgroundColor: '#f4511e'}}
        source={require('./spiro.png')}
    />
),
```

## 设置后退文本

后退的文本要设置在原来页面中，比如你要从 a 页面跳到 b 页面，然后如果要在 b 页面中点击后退按钮返回 a 页面的话，那就要在 a 页面中设置 b 页面的后退文本。

## 使用全局的 navigationOptions

使用这个的时候，注意只有在 static navigationOptions 的回调函数中才可以获得 defaultNavigationOptions 对象。在 props 中是拿不到的。

## 在使用 tabStack 的时候返回另一 tab 的页面

因为使用 TabNavigator 的时候，当你从其中的一个 tab 的页面跳转到另一个 tab 的子页面时候，点击导航栏的返回时，它是返回到你跳转之后的的 tab 到主页面。因为当你跳转到另一个 tab 页的时候，route 的栈被清空，push 新的 tab 路由，然后再跳转到子页面，这个时候你在子页面中点击返回，也就自然而然的返回到了新的 tab 页面，而不是之前 tab 的页面。

如果想实现这个功能，可以在 TabNavigator 外包一层 StackNavigator，然后将可以在各个 tab 页面中跳转的页面添加到 StackNavigator 中，这样这个页面就和 TabNavigator 处在同一级别上。

## Text

首行缩进： `<Text>{'\t'}</Text>`

展示像 ul 中前面圆点的效果：

```js
list = lists => {
  return (
    <View>
      {lists.map((el, idx) => (
        <View key={idx} style={{ flexDirection: "row" }}>
          <Text style={{ color: "#7a7a7a" }}>{"\u2022  "}</Text>
          <Text style={{ color: "#7a7a7a", fontSize: 14, lineHeight: 20 }}>
            {el}
          </Text>
        </View>
      ))}
    </View>
  );
};
```

其实每个圆点，方块等效果都可以用 unicode character 来表示。

## FlatList

因为 FlatList 继承的是 PureComponent，所以你传入数组的时候，如果要触发更新，就必须更改数组的指针。不然是不会触发更新的，比如 push，它也只是在原先的地址上增加元素，指针没有改变。可以使用 concat 来出发更新。

id 是 string 类型的。

## Fetch

使用 fetch 的时候要注意带上设置 headers 上的'Content-Type'。

## 清除缓存

现在 github 上的所有清除缓存插件都已经不维护了，所以现在主要是通过 react-native-fs 来实现这个功能。

此外，react-native-fs 的功能也很强大，可以在缓存目录中读写，获取文件目录等等。

## 视频截取，剪辑

react-native-ffmpeg 和 react-native-fs 互相配合

## 录视频

react-native-camera

## 获取文件目录

react-native-cameraRoll
