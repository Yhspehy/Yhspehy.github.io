---
layout: post
title: Express 学习笔记
tag: 技术
keywords: Express
---

 Express相关的学习笔记


 ## nodemon实现代码更新后自动重启服务

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