---
title: "方法"
description: "属于某个值的函数，通过点号调用，例如 `\"Jeremy\".includes(\"e\")` 或 `\"Jeremy\".toUpperCase()`"
en_md5: 37c097a81459cd2ff4ae684559bd4311
---

到目前为止，当我们想到字符串或数字时，我们觉得它们是很静态的东西。

虽然它们确实很静态，但它们也内置了很多 Jiki 可以使用的功能。

随着我们继续学习，我们会逐渐了解这些功能，这些它们拥有的能力，会让你的编程生活轻松很多。

我们将学习两种能力：属性（英语：property）和方法（英语：method）。

方法是属于字符串的函数。

这样，我们就不必自己写一个函数，把字符串当作输入传进去；可以直接在字符串上使用方法。

比如，还记得那种检查字符串里是否包含某个特定字母的函数吗？实际上，字符串有一个叫做 `includes`（检查是否包含）的方法，就可以做到这一点，而且我们可以用你见过的属性点语法来使用它。

与属性不同的是，我们在写方法时，会像写函数一样使用括号和输入。

所以我们可以这样写：

```javascript
"Jeremy".includes("e") // true
```

并且我们会得到 `true`，因为 `"Jeremy"` 里面有一个 `"e"`。

<img
  class="concept-image"
  src="/static/images/concept-assets/methods/jiki-writing-jeremy.webp"
  alt="Jiki 正在一张纸上写下字符串 Jeremy"
  width="359"
  height="400"
/>

方法与属性不同，因为它们不是静态的事实；它们实际上是函数。你可以把它们想象成内置了一个盒子，字符串就放在里面的一些函数。

它们具体如何工作现在其实不重要，你暂时还不会自己编写它们。你只需要知道，使用方法是通过一个点，然后接上普通的函数语法。

关于字符串，有一件事需要了解：方法不会改变字符串内部的任何东西。例如，有一个叫做 `toUpperCase`（转为大写）的方法，它会返回所有字母都大写的字符串。但这并不会改变原来的字符串。它仍然保存着首字母大写的 `"Jeremy"`。相反，Jiki 会创建一个全部大写的全新字符串。

```javascript
const name = "Jeremy"
const bigName = name.toUpperCase()

log(bigName) // "JEREMY"
log(name) // "Jeremy"
```
