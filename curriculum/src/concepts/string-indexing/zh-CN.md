---
title: "字符串下标"
description: "使用方括号和位置编号从字符串中取出单个字母。请记住，位置从零开始。"
en_md5: cd31e0366b3090b358494667003f54c9
---

想象一下，你有我的名字 Jeremy，你想从中取出我的首字母 J。我们该怎么做呢？

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-thinking.webp"
  alt="Jiki 在思考如何从字符串中取出单个字母"
  width="361"
  height="353"
/>

嗯，你可以把字符串看作一连串的字母。所以 `"Jeremy"` 有六个字母，J-E-R-E-M-Y，每个字母都有一个位置。`"J"` 在第一个位置，`"y"` 在最后一个位置。

好的，在 JavaScript 和大多数编程语言中，这些位置是从 0 开始的。所以第一个字母 `"J"` 在位置 0，下一个字母 `"e"` 在位置 1，`"r"` 在 2，`"e"` 在 3，`"m"` 在 4，`"y"` 在 5。

嗯，这个从 0 开始的事情确实有点奇怪，老实说，如果像普通世界那样从 1 开始数，生活会容易得多。但我们没有。在大多数编程语言中，我们是从 0 开始数的，所以你只需要记住这一点。

所以，如果我们想获取特定位置的字母，可以使用方括号，里面写上数字。

所以，如果我们写 `"Jeremy"[0]`，意思就是给我单词 `"Jeremy"` 的第一个字母。

如果我们写 `"Jeremy"[1]`，意思就是给我第二个字母。

```javascript
"Jeremy"[0] // "J"
"Jeremy"[1] // "e"
```

我们也可以对变量这样做。如果我们创建一个名为 `name`（名字）的变量，并将其值设为字符串 `"Jeremy"`，那么我们就可以执行 `name[0]`，然后再次得到 `"J"`。

```javascript
let name = "Jeremy"
name[0] // "J"
```

需要明确的一点是，你从 `name[0]` 得到的东西只是另一个字符串。它不过是一张写着 J 的纸而已，没什么特别之处。它就是一个字符串，就像 `"Jeremy"` 是一个字符串一样。

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-holding-j.webp"
  alt="Jiki 拿着一张刚写好的、上面只有字母 J 的纸"
  width="500"
  height="289"
/>

它只是碰巧上面只有一个字母，而不是六个。

而且这样做根本不会影响原来的字符串。我们并没有把 J 撕下来之类的。我们只是找到我们想要的字母，然后用它创建一个新的字符串。
