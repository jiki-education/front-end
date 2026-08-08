---
title: "字符串拼接"
description: "使用 `+` 将字符串相加，把固定文本和变量连接成一个更长的字符串。"
en_md5: 0e6c7a941a1fb1161445da27a4d7e818
---

你已经知道字符串是什么了。它们就是一张张写着文字的纸片。

到目前为止，你用的每个字符串都是直接打出来的。如果你想根据变量或条件来构建一个字符串，那该怎么办？我们该怎么做呢？

有两种方法。

第一种方法叫作字符串拼接（英语：_string concatenation_），这是个挺文绉绉、有点绕的说法，其实就是把两个字符串加在一起。

假设你有两个单词，`"hello"`（你好）和 `"world"`（世界），而你想生成一个包含 `"hello world"` 的字符串。

你当然可以直接写成一个字符串 `"hello world"`，但你也可以写成 `"hello " + "world"`，这样也会得到相同的字符串。

现在，显然，在这个场景里这没多大用处。可是，如果我们有一个装着某人名字的变量，想向他打个招呼，那该怎么办呢？

所以我们假设有一个叫做 `name`（名字）的变量，它有时候装着 `"Jeremy"`（人名 Jeremy），有时候装着 `"Jiki"`（人名 Jiki）。我们想用这个变量来说出 `"hello Jeremy"` 或 `"hello Jiki"`。

<img
  class="concept-image"
  src="/static/images/concept-assets/string-concatenation/jiki-name-box.webp"
  alt="Jiki 拿着一个标有 name 的盒子，里面可以装不同的值"
  width="207"
  height="400"
/>

嗯，我们可以用这个拼接概念来做到：

```javascript
"hello " + name // "hello Jeremy" or "hello Jiki"
```

这样我们就会得到 `"hello Jeremy"`、`"hello Jiki"`，或者向其他任何人问好，这取决于 `name` 这个盒子里装的是什么。
