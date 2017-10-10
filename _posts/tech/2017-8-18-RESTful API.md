---
layout: post
title: RESTful API接口规范
tag: 技术
keywords: RESTful
---

RESTful API接口规范

## 1.协议

API与用户的通信协议，总是使用HTTPs协议。

## 2.域名

应该尽量将API部署在专用域名之下。

`https://api.example.com`

如果确定API很简单，不会有进一步扩展，可以考虑放在主域名下。

`https://example.org/api/`

## 3.版本 (Versioning）

应该将API的版本号放入URL。

`https://api.example.com/v1/`

## 4.路径（Endpoint）

路径又称"终点"（endpoint），表示API的具体网址。

在RESTful架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种记录的"集合"（collection），所以API中的名词也应该使用复数。

举例来说，有一个API提供动物园（zoo）的信息，还包括各种动物和雇员的信息，则它的路径应该设计成下面这样。

* `https://api.example.com/v1/zoos`
* `https://api.example.com/v1/animals`
* `https://api.example.com/v1/employees`


## 5.HTTP动词

对于资源的具体操作类型，由HTTP动词表示。

常用的HTTP动词有下面五个（括号里是对应的SQL命令）。

* GET（SELECT）：从服务器取出资源（一项或多项）。
* POST（CREATE）：在服务器新建一个资源。
* PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
* PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
* DELETE（DELETE）：从服务器删除资源。
* (不常用) HEAD：获取资源的元数据。  
* (不常用) OPTIONS：获取信息，关于资源的哪些属性是客户端可以改变的。  

下面是一些例子:

* GET /zoos：列出所有动物园
* POST /zoos：新建一个动物园
* GET /zoos/ID：获取某个指定动物园的信息
* PUT /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
* PATCH /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
* DELETE /zoos/ID：删除某个动物园
* GET /zoos/ID/animals：列出某个指定动物园的所有动物
* DELETE /zoos/ID/animals/ID：删除某个指定动物园的指定动物

## 6.过滤信息（Filtering）

如果记录数量很多，服务器不可能都将它们返回给用户。API应该提供参数，过滤返回结果。

下面是一些常见的参数。

* ?limit=10：指定返回记录的数量
* ?offset=10：指定返回记录的开始位置。
* ?page=2&per_page=100：指定第几页，以及每页的记录数。
* ?sortby=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序。
* ?animal_type_id=1：指定筛选条件

## 7.错误处理（Error handling）和 Hypermedia API

如果你的API没有错误处理是很难的，只是返回500和出错堆栈不一定有用。

常见的有以下一些:

* 200 – OK – 一切正常
* 201 – OK – 新的资源已经成功创建
* 204 – OK – 资源已经成功擅长
* 304 – Not Modified – 客户端使用缓存数据
* 400 – Bad Request – 请求无效，需要附加细节解释如 "JSON无效"
* 401 – Unauthorized – 请求需要用户验证
* 403 – Forbidden – 服务器已经理解了请求，但是拒绝服务或这种请求的访问是不允许的。
* 404 – Not found – 没有发现该资源
* 406 - Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
* 422 – Unprocessable Entity –只有服务器不能处理实体时使用，比如图像不能被格式化，或者重要字段丢失。
* 500 – Internal Server Error – API开发者应该避免这种错误。


RESTful API最好做到Hypermedia，即返回结果中提供链接，连向其他API方法，使得用户不查文档，也知道下一步应该做什么。

使用详细的错误包装错误：
```js
{
  "errors": [
   {
    "userMessage": "Sorry, the requested resource does not exist",
    "internalMessage": "No car found in the database",
    "code": 404,
    "more info": "http://dev.mwaysolutions.com/blog/api/v1/errors/12345"
   }
  ]
}
```

## 8.数据 (data)

服务器返回的数据格式，应该尽量使用JSON，避免使用XML。

* GET /collection：返回资源对象的列表（数组）
* GET /collection/resource：返回单个资源对象
* POST /collection：返回新生成的资源对象
* PUT /collection/resource：返回完整的资源对象
* PATCH /collection/resource：返回完整的资源对象
* DELETE /collection/resource：返回一个空文档


## 结尾

> ### 相关链接：
> * RESTful API设计指南戳[这里](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)
> * 10个有关RESTful API良好设计的最佳实践戳[这里](http://www.jdon.com/soa/10-best-practices-for-better-restful-api.html)
