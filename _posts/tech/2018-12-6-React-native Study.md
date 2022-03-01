---
layout: post
title: React-Native Study
tag: App
keywords: React-Native
---

# React-Native Study

## Expo

安装 ios 的 Expo 软件，并注册账号，然后即可在网页的 expo 中调试 app 中的页面，也不需要自动保存，还是很方便的。

## React Navigation

[doc](https://reactnavigation.org/docs/en/getting-started.html)

## 设置标题后退的图片

图片要设置在目标的页面中, 并且只接受 React Element 或者 Component, 所以以前版本的直接 require 是会报错的。

``` jsx
const style = {width: 30, height: 30 ,backgroundColor: '#f4511e'}
headerBackImage: (
    <Image
        style={style}
        source={require('./spiro.png')}
    />
)
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

``` js
const styleA = { flexDirection: "row" }
const styleB = { color: "#7a7a7a" }
const styleC = { color: "#7a7a7a", fontSize: 14, lineHeight: 20 }

list = lists => {
  return (
    <View>
      {lists.map((el, idx) => (
        <View key={idx} style={styleA}>
          <Text style={styleB}>{"\u2022  "}</Text>
          <Text style={styleC}>
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

但是这里我们只能获取到自己设置的缓存文件，而其他的原生内容缓存还暂时获取不到，比如Image.prefetch的disk cache我们并不能直接获取到，这里是需要调用原生的清缓存接口，所以还是比较麻烦。

## 视频截取，剪辑

react-native-ffmpeg 和 react-native-fs 互相配合。

视频编辑功能：
因为要考虑到视频入口的方式有两种，一种是相册选取，一种是直接拍视频然后编辑，其中相册选中中安卓和ios的视频存储路径又不同，并且使用react-native-video的时候又不能直接使用ph格式(ios)的视频文件，所以这里做好做个统一的处理，使用cache目录的视频文件。所以这里需要先对相册导入对视频文件做copy，然后再对cache中对视频做裁剪，并导出final video在cache目录中。

## 录视频

react-native-camera

## 获取照片目录

react-native-cameraRoll

## Animated

在使用Animated的时候，如果使用了useNativeDriver：true，那么在设置transform的scale的时候，要注意inputRange的边界范围。

```jsx
<Animated.View
  style = {
    [
      styles.button,
      {
        transform: [
          {
            scale: this._deltaX.interpolate({
            inputRange: [-100, -100, -50, -50],
            outputRange: [1, 1, 0.8, 0.8],
          },
        ]
      },
    ]
  }
/>
```

如果要监听手势或者滚动事件的话，最好使用Animtated.event().

```jsx
import React, { useRef } from 'react';
import { SafeAreaView, Animated, PanResponder } from 'react-native';

function Pan() {
  const translateX = useRef(new Animated.Value(0));
  const style = {
    backgroundColor: 'red',
    height: 100,
    transform: [
      {
        translateX: translateX.current,
      },
    ],
  }
  
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: Animated.event([
        null,
        {
          dx: translateX.current,
        },
      ]),
      onPanResponderRelease: (evt, gestureState) => {
        Animated.spring(translateX.current, {
          toValue: 0,
          friction: 5,
        }).start();
      },
    }),
  );

  return (
    <SafeAreaView>
      <Animated.View
        {...pan.current.panHandlers}
        style={style}
      />
    </SafeAreaView>
  );
}
```

但是现在PanResponder不支持useNativeDriver参数，因为PanResponder是完全使用纯js实现的，所以如果想要使用性能更好的手势动画，可以使用react-native-interactable库。

在一些页面内容复杂，而我们只想实现某一小部分内容的动画的时候，我们可以使用setNativeProps。setNativeProps方法可以使我们直接修改基于原生视图的组件的属性，而不需要使用setState来重新渲染整个组件树。

而如果有些动画中的内容是未知的时候，则可以使用LayoutAnimation。就比如评论展开收缩功能，当评论收缩的时候，我们并不知道展开后的评论内容的高度究竟是多少，那么这个时候我们使用LayoutAnimation，native端则会自动执行动画,所以他比较适用于那些flex布局内的元素动画。
注意，在使用这个的时候，A common way to use this API is to call it before calling `setState`.
所以他仅仅只会在下一次layout变化的时候显示动画。

## 聊天功能

由于http协议的局限性，聊天功能可以使用MQTT协议来实现。

目前是使用网易云信。

## React Native Navigation

V3，使用showModal的时候，如果modal的layout是bottomTabs或者sideMenu的话，在ios则会展示一种不一样的效果。

这个时候如果要关闭这个modal的话，直接使用dismissModal是不行的，因为这个时候展示的页面仅仅是这个layout中的一个component或者stack中的component，所以直接调用dismissModal只会将当前的component弹掉，而不是关闭modal。如果要关闭modal则需要监听父页面中showModal的事件，获取layoutId，并将layoutId传给modal，那么在modal中可以直接用dismissModal(layout)来关闭modal。

具体怎么把layoutId传给modal，则是在监听事件中直接修改params的passProps。注意这里要区分事件的type。

RNA和React Navigation的区别：RNA是基于原生的路由，但是React Navigation是基于Animated和JS的，所以性能肯定RNA比较优秀，但是在入手的门槛上RNA也高了不少，收看RNA是没有中文文档的，其次RNA还需要安卓和IOS自行配置一部分内容，而且安卓的比较难弄。在对于一些特定的效果比如：底部tab点击显示modal，这个效果中，RNA是比较难做的，因为它不支持BottomTab的点击事件，强行写的话就需要使用overLay覆盖在bottomTab上并添加modal，但是这个时候又有个问题，那就是overLay是不允许往modal中新增stack的，也就是不能使用push等等功能，这就导致了我不能存在后续的操作，但是这显然是不可能的。

##
