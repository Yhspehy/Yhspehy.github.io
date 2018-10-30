---
layout: post
title: Docker Study
tag: 技术
keywords: Docker
---

## 删除本地的镜像

如果删除本机的镜像则需要先删出使用该镜像的容器。


## 在docker中连接宿主本机的mongodb

因为mongodb的地址不是共有ip，而且docker中的127.0.0.1不是宿主的127.0.0。1。
如果要连接宿主本机的mongodb，需要把mongodb的接口暴露出来，不能只有127.0.0.1可以访问，可以允许宿主ip访问，然后在程序中连接宿主ip:端口来连接。

如果要使用127.0.0.1，可以使用--net=host来暴露宿主所有的端口，在docker for mac中，也可以使用docker.host.internet。具体使用情况可以google。




