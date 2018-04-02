---
layout: post
title: flow学习笔记
tag: 技术
keywords: flow
---

之前只有TypeScript有静态类型的检查，也知道flow这个工具。最近在看Vue的源码，发现它用的全是flow，所以特地来学习一下！


## 类型声明

```js
// @flow
function concat (a: string, b: string) {
  return a + b;
}

concat("A", "B");  // Works!
concat(1, 2);   // Errors!
```

## 基本类型

基本类型有：
1. Booleans
2. Strings
3. Numbers
4. null
5. undefined（void也包含在flow type中）
6. Symbols（es2015中的类型，但是还未加入到flow的type中）

关于这几种基本类型的判断不做多补充。


### 可能的类型

```js
// @flow
function acceptsMaybeString (value: ?string) {
  // ...
}

这个代表value的值可以为string、undefined、null或空。
```


### 对象属性类型

```js
// @flow
function acceptsObject (value: { foo?: string }) {
  // ...
}

acceptsObject({ foo: "bar" });     // Works!
acceptsObject({ foo: undefined }); // Works!
acceptsObject({ foo: null });      // Error!
acceptsObject({});                 // Works!


这个value的foo属性可以为string，undefined或空，但是不能为null
```


### 函数参数类型

```js
// @flow
function acceptsOptionalString (value?: string) {
  // ...
}

acceptsOptionalString("bar");     // Works!
acceptsOptionalString(undefined); // Works!
acceptsOptionalString(null);      // Error!
acceptsOptionalString();          // Works!


这个value可以为string，undefined或空，但是不能为null
```


### 带默认值的函数参数类型

```js
// @flow
function acceptsOptionalString(value: string = "foo") {
  // ...
}

acceptsOptionalString("bar");     // Works!
acceptsOptionalString(undefined); // Works!
acceptsOptionalString(null);      // Error!
acceptsOptionalString();          // Works!

这个value可以为string，undefined或空，但是不能为null,当value为空的时候，函数中的value就为foo。
```


### Symbols

flow还未支持Symbols。



## 使用特定的值作为参数

```js
// @flow
function acceptsTwo(value: 2) {
  // ...
}
这个函数只接受value为2的参数，否则报错

function getColor(name: "success" | "warning" | "danger") {
  switch (name) {
    case "success" : return "green";
    case "warning" : return "yellow";
    case "danger"  : return "red";
  }
}
这个函数只接受name为"success", "warning"和"danger"这三个参数中的一个，否则报错。
```


## 混合类型

mixed能接受任何参数，但是不会返回任何数据。  
如果要使用mixed类型的参数，你必须要要得到这个参数的类型或者你将会直接以error结束。

```js
// @flow
function stringifyBasicValue(value: string | number) {
  return '' + value;
}
这个函数接受只value为string或number。


function getTypeOf(value: mixed) {
  return typeof value; // Error!
}

function stringify(value: mixed) {
  if (typeof value === 'string') {
    return "" + value; // Works!
  } else {
    return "";
  }
}

这个函数接受任何参数。

因为在if语句中判断了typeof value === 'string'，flow将会知道这个value只可能是string，所以将不会报错。

```


## 任何类型

any和mixed的区别就是，any可以直接输出结果，但是mixed需要先判断才能输出。所以any不是非常的安全，因为他不会帮你去做类型判断，也不会报错。

```js
// @flow
function getNestedProperty(obj: any) {
  return obj.foo.bar.baz;
}

getNestedProperty({});

即使这种在运行中会报错的函数也不会被flow捕捉到。
```


## 函数

```js
// @flow
function concat(a: string, b: string): string {
  return a + b;
}

concat("foo", "bar"); // Works!
// $ExpectError
concat(true, false);  // Error!

这个函数的参数a和b必须为string，而且这个函数的返回值也必须为string类型。
```

## 对象

跟普通的js不同，在flow中，你如果创建了一个包含属性的对象，则这个对象是一个封闭对象，你能再给这个对象赋值。

```js
// @flow
var obj = {
  foo: 1
};

// $ExpectError
obj.bar = true;    // Error!
// $ExpectError
obj.baz = 'three'; // Error!


var obj = {};

obj.foo = 1;       // Works!
obj.bar = true;    // Works!
obj.baz = 'three'; // Works!
```

## 数组

数组的flow形式为：`Array<type>` 或 `type[]`。

?type[] = ?Array[type] and not Array[?type]。

```js
// @flow
let arr1: ?number[] = null;   // Works!
let arr2: ?number[] = [1, 2]; // Works!
let arr3: ?number[] = [null]; // Error!
```

函数使用也可能不安全

```js
// @flow
let array: Array<number> = [0, 1, 2];
let value: number = array[3]; // Works.
                       // ^ undefined

所以你需要自己完善这个静态类型判断

let array: Array<number> = [0, 1, 2];
let value: number | void = array[1];

if (value !== undefined) {
  // number
}
```

## Tuple

在js中，tuple由数组创建，但是区别在于，tuple中它可以对数组中的每个元素定义静态类型。

```js
// @flow
let tuple: [number, boolean, string] = [1, true, "three"];

tuple[0] = 2;     // Works!
tuple[1] = false; // Works!
tuple[2] = "foo"; // Works!

// $ExpectError
tuple[0] = "bar"; // Error!
// $ExpectError
tuple[1] = 42;    // Error!
// $ExpectError
tuple[2] = false; // Error!
```
### tuple的静态类型只匹配相同长度的tuple
不能再tuple上使用数组的原型方法，除了`join`。

```js
// @flow
let array: Array<number>    = [1, 2];
// $ExpectError
let tuple: [number, number] = array; // Error!
```
### Tuple不匹配数组

```js
// @flow

let tuple: [number, number] = [1, 2];
// $ExpectError
let array: Array<number>    = tuple; // Error!

let tuple: [number, number] = [1, 2];
tuple.join(', '); // Works!
// $ExpectError
tuple.push(3);    // Error!
```

### 不能在Tuple上使用数组的原型方法，除了`join`。

```js
// @flow
let tuple: [number, number] = [1, 2];
tuple.join(', '); // Works!
// $ExpectError
tuple.push(3);    // Error!
```


## Class

在flow中，你写class和平常没什么区别，但是在你使用的时候你可以定义这个class是哪个class。

```js
class MyClass {
  // ...
}

let myInstance: MyClass = new MyClass();

这是因为在flow中class就是一个基本的类型。
```

### Class语法

使用class中的方法的时候和函数的没区别。

但是在class中使用变量的时候你必须先声明它的类型。

```js
// @flow
class MyClass {
  method() {
    // $ExpectError
    this.prop = 42; // Error!
  }
}

class MyClass {
  prop: number;
  method() {
    this.prop = 42;  // Works!
  }
}
```

flow也支持class properties syntax.

```js
// @flow
class MyClass {
  prop = 42;
}
or
class MyClass {
  prop: number = 42;   // 并不是必须的
}
```

## type别名

使用type字段创建。

```js
// @flow
type MyObject<A, B, C> = {
  foo: A,
  bar: B,
  baz: C,
};

var val: MyObject<number, boolean, string> = {
  foo: 1,
  bar: true,
  baz: 'three',
};
```

## Opaque Type Aliases

Opaque Type Aliases跟Type Aliases类似，只不过它不能应用在定义它的文件之外。当别的文件引用它的时候，它只是一个普通的类型，而不是定义的类型。

```js
export opaque type NumberAlias = number;

import type {NumberAlias} from './exports';

(0: NumberAlias) // Error: 0 is not a NumberAlias!

function convert(x: NumberAlias): number {
  return x; // Error: x is not a number!
}
```


