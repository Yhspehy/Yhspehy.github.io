---
layout: post
title: Python 学习笔记
tag: 技术
keywords: Python
---

## 安装 pylint 的时候

我安装完 pylint，但是 vscode 还是显示未安装。原因是默认路径不对。

```py
终端中输入which pylint

然后修改设置中pylint的path为返回的路径
```

## 函数

### 函数参数传递

```py
1. fun(arg1, arg2)
2. fun(arg1, arg2='a')   设置默认参数
3. fun(*arg1)    可传入多个参数，不管有多少个，在函数内部都被存放在以形参名为标识符的tuple中。如果要传入list和tuple，则可以写fun(*list),这样就可以讲list的值依次传入fun函数中。
4. fun(**arg2)   参数在函数内部将被存放在以形式名为标识符的dictionary中,传入的参数必须采用key1=value1,key2=value2这样的格式。
```

参数定义的顺序必须是：必选参数、默认参数、可变参数、命名关键字参数和关键字参数。

## Class

`__slots__`定义的属性仅对当前类实例有用，对继承的子类是不起作用的。

## 进程

### fork

在 Unix/Linux 中可以使用 fork()来创建进程，window 下不能。

```py
import os;
// 子进程永远返回0，而父进程返回子进程的ID。
pid = os.fork()

if pid == 0:
    print('I am child')
else:
    print('I am parent')
```

### multiprocessing

multiprocessing 模块是 python 下跨平台的多进程模块。

```py
from multiprocessing import Process

// 传入一个执行函数和函数的参数
p = Process(target=fun, args=('test',)
p.start()
p.join()
```

## 线程

```py
import threading

// 传入一个执行函数和线程的名称
t = threading.Thread(target=fun, name='name')
t.start()
t.join()
```


## json

json.load用来加载json数据，此时返回的数据可以通过json['key']来获取内部属性。

json.dumps用来处理json数据，然后返回字符串，我们不能通过返回的字符串再来获取json的内部属性了。

```py
loadJson1 = json.loads(json)     // right
loadJson2 = json.loads(json['key'])     // wrong

dumpJson1 = json.dumps(loadJson1)  // right
dumpJson2 = json.dumps(loadJson1['key'])   // right

json = dumpJson1['key']   // wrong
```