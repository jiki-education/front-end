---
title: "属性"
description: "关于值的静态事实，通过点号访问，无需括号，比如`.length`可以知道一个字符串有多少个字母。"
en_md5: 0634cd72388bef118e9dd22131a3c1cd
---

目前为止，当我们思考字符串或数字时，我们把它们看作相当静态的东西。

尽管它们确实如此，但它们也内置了许多功能，Jiki 可以使用它们。

我们要学习两种能力：属性和方法。

属性是我们能让 Jiki 告诉我们关于某事物的信息。例如，字符串有一个叫做`length`（长度）的属性，Jiki 可以用它来告诉我们一个字符串有多长。

所以，我们不必遍历所有字母来计算字符串有多大，我们只需要让 Jiki 告诉我们。

为此，我们使用一种新的语法形式：点号。

例如，如果我们有字符串 `"Jeremy"`，并且想获取它的长度，我们可以这样写：

```javascript
"Jeremy".length // 6
```

当 Jiki 创建一个字符串时，他会数字母的数量，然后记下一个数字在旁边，表示有多少个字母。

<img
  class="concept-image"
  src="/static/images/concept-assets/properties/jiki-counting-letters.webp"
  alt="Jiki 数着字符串 Jeremy 的字母并在角落写下数字"
  width="359"
  height="400"
/>

然后，当我们使用`length`属性时，Jiki 只是去查看那个数字是多少。所以，在我们的 `"Jeremy".length` 例子中，当 Jiki 创建字符串 `"Jeremy"` 时，他数字母，在角落写下数字 6，然后当我们写 `"Jeremy".length` 时，他去查看它。所以，你可以把属性看作关于那个事物的事实。
