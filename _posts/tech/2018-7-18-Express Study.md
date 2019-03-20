---
layout: post
title: Express 学习笔记
tag: 技术
keywords: Express
---

Express 相关的学习笔记

## nodemon 实现代码更新后自动重启服务

```js
   yarn add global nodemon

   nodemon.json内容

   {
       "restartable": "rs",
       "ignore": [
           ".git",
           ".svn",
           "node_modules/**/node_modules"
       ],
       "verbose": true,
       "execMap": {
           "js": "node --harmony"
       },
       "watch": [

       ],
       "env": {
           "NODE_ENV": "development"
       },
       "ext": "js json"
   }
```

## Express 跨域

```js
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
```

这类写法的跨域问题是只针对路由的，对于静态资源文件来说还是存在跨域问题的。

如果要解决静态文件资源的跨域问题，要在 express.static 中也要设置。

```js
const options = {
  setHeaders: function(res, path, stat) {
    res.set("Access-Control-Allow-Origin", "*");
  }
};
app.use(express.static("image", options));
```

更简便的方法便是使用 cors 库。
