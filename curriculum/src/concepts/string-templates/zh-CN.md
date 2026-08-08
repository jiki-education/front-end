---
title: "字符串模板"
description: "使用反引号和 `${...}` 占位符直接将值插入字符串，无需使用 `+` 拼接片段。"
en_md5: 7fd0e09ac3b32db5f159f8e772872104
---

我们可以使用一种叫做模板字面量（英语：_template literals_）的方法来把字符串插入其他字符串中。

因此，与其把字符串拼接起来，我们可以用一个字符串或者模板，里面给其他字符串留有位置。

为此，我们使用反引号（英语：_backticks_）而不是引号。

反引号，顾名思义，就是反向的引号，但你可能以前从未用过，所以得找到键盘上那个正确的键。

我们用反引号来创建一个可以容纳其他字符串的模板。然后，要将一个字符串插入模板，我们还需要用美元符号和大括号这种奇怪的语法。例如，要实现刚才用拼接做到的 `"hello " + name` 效果，我们可以写成：

```javascript
`hello ${name}` // "hello Jeremy" 或 "hello Jiki"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/string-templates/jiki-name-box.webp"
  alt="Jiki 拿着一个标有 name 的盒子，其中的值将插入模板"
  width="207"
  height="400"
/>

这跟把字符串拼接起来效果完全一样。

但是，当你有多个字符串都需要拼接到一个地方时，这种方法会高效得多。

适应这种精确的语法需要一点时间，但并没有多复杂。
