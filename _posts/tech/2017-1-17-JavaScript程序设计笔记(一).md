---
layout: post
title: JavaScript高级程序设计笔记（一）
tag: 技术
keywords: JavaScript
---

##	 JavaScript简介

JavaScript由三部分组成：
1. 核心(ECMAScript),提供核心语言功能；
2. 文档对象模型(DOM)，提供访问和操作网页内容的方法和接口；
3. 浏览器对象模型(BOM)，提供与浏览器交互的方法和接口。

## script

&lt;script&gt;定义了下列6个属性：
1. async：可选。表示应该立即下载脚本，但不应该妨碍页面中的其他操作，比如下载其他资源或等待加载其他脚本。只对外部脚本文件有效。
2. charet：可选。表示通过src属性指定的代码的字符集。由于大多数浏览器会忽略它的值，因此这个属性很少有人用。
3. defer：可选。表示脚本可以延迟到文档完全被解析和显示之后再执行。只对外部脚本文件有效。IE7及更早版本对嵌入脚本也支持这个属性。
4. language：已废弃。
5. src：可选。表示包含要执行代码的外部文件。
6. type：可选。可以看成是language的替代属性；表示编写代码使用的脚本语言的内容类型（也称为MIME类型）。其默认值为text/javascript。

使用CData片段来包含Javascript代码。这个区域中可以包含不需要解析的任意格式的文本内容。

```javascript
<script type="text/javascript">
	//<![CDATA[
		function compare(a, b){
			if (a < b)
				alert("A is less than B");
		} else if (a > b){
			alert ("A is greater than B");
		} else {
			alert ("A is equal to B");
		}
	//]]>
</script>
```

使用&lt;noscript&gt;元素可以指定在不支持脚本的浏览器中显示的替代内容。但在启动了脚本情况下，浏览器不会显示&lt;noscript&gt;元素中的任何内容。

## 基本概念

### 标识符

标识符，就是指变量，函数，属性的名字，或者是函数的参数。标识符可以是按照下列格式规则组成起来的一或多个字符。

 - [ ] 第一个字符必须是一个字母、下划线（_）或一个美元符号($)
 - [ ] 其他字符可以是文字、下划线、美元符号或数字  
标识符中的字母也可以包括扩展的ASCII或Unicode字母字符，但不推荐这么做。  
不能把关键词、保留字、true、false和null用作标识符。
 
### 注释

// 单行注释

/\*  
 \*	这是一个多行  
 \*	（块级）注释  
\*/

### 变量

ECMAScript的变量是松散类型的，所谓缩松类型就是可以用来保存任何类型的数据。

省略var操作符可以定义全局变量，但是不推荐。因为在局部作用于中定义的全局变量很那尾部。

### 数据类型

ECMAScript中由5中简答数据类型（也称为基本数据类型）：Undefined、Null、Boolean、Number和String。还有一种复杂数据类型——Object，Object本质上由一组无序的名值对组成。

---

#### typeof操作符

用来检测给定变量的数据类型。

typeof是一个操作符而不是函数。

---

#### Undefined类型

Undefined类型只有一个值，即特殊的undefined。在使用var声明变量但卫队其加以初始化时，这个变量的值就是undefined。

对未初始化的变量执行typeof操作符会返回undefined值，而对未声明的变量执行typeof操作符同样会返回undefined值。

---

#### Null类型

Null类型是第二个只有一个值的数据类型，这个特殊的值是null。从逻辑角度来看，null值表示一个空对象指针，而这也正是使用typeof操作符检测null值时会返回"object"的原因。

如果定义的变量准备在将来用于保存对象，那么最好将该变量初始化为null而不是其他值。这样一来，只要检查null值就可以知道相应的变量是否已经保存了一个对象的引用，如下面的例子所示：

```javascript
if (car !=null){
	// 对car对象执行某些操作
}
```
实际上，undefined值是派生自null值的，所以他们的相等性测试要返回true：

```
alert(null == undefined);	//true
```

---

#### Boolean类型

Boolean类型是ECMAScript中使用得最多的一种类型，改类型只有两个字面值：true和false。  
这两个值与数字值不是一回事，因此true不一定等于1，而false也不一定等于0。

|数据类型	|转化为true的值	 |转化为false的值	|
|-	|  :-:	| :-: |
|Boolean 	|true	|false	|
|String  |任何非空字符串  |""(空字符串)  |
|Number  |任何非零数字值(包括无穷大)  |0和NaN  |
|Object  |任何对象  |null  |
|Undefined  |n/a  |undefined  |

---

#### Number类型

在默认情况下，ECMAScript会将那些小数点后面带有6个零以上的浮点数值转换以为e表示法表示的数值（例如0.0000003会被转换成3e-7）。

注意，永远不要测试某个特定的浮点数值。例如：

```
if (a + b == 0.3){
	alert("You got 0.3");
}
```
如果测试的两个数是0.25和0.05则可以通过，但是如果是0.1和0.2，那么测试将无法通过。

NaN，即非数值是一个特殊的数值，这个数值用于表示一个本来要返回数值的操作数未返回数值的情况。  
可以用isNaN()函数来帮我们确定这个参数是否“不是数值”。

```javascript
alert(isNaN(NaN));    //true
alert(isNaN(10));     //false(10是一个数值)
alert(isNaN("10"));   //false(可以被转换为10)
alert(isNaN("blue")); //true(不能转换为数值)
alert(isNaN(true));   //false(可以被转换为1)
```

数值转换有3中方法：Number()、parseInt()、parseFloat()。

Number()可以用于任何数据类型，而另外两个函数则专门用于把字符串转换成数值。

parseInt()不会忽略前导零，而且能识别各种整数格式。直到找到第一个非空格字符。  
不过ECMAScript3和5存在分歧。所以最好添加第二个参数。  
比如：  
```javascript
var num1 = parseInt("10", 2);    //2(按二进制解析)
var num2 = parseInt("10", 8);	 //8(按八进制解析)
var num3 = parseInt("10", 10);	 //10(按十进制解析)
var num4 = parseInt("10", 16);   //16(按十六进制解析)
```

parseFloat()是解析到遇见一个无效的浮点数字符为止。所以第一个小数点是有效的。而且它始终忽略前导零。

---

#### String类型

转换为字符串有两种方法，一个是toString()，但null和undefined值没有这个办法。他可以传递输出数值的基数，如二进制十进制。   
另一个是String()，String()函数会返回null和undefined的字面量。

---

#### Object类型

操作符包括算数操作符（如加号和减号）、位操作符、关系操作符和相等操作符。

只能操作一个值的操作符叫做一元操作符，一元操作符是ECMAScript中最简单的操作符。  
1. 递增和递减操作符
2. 一元加和减操作符  



















