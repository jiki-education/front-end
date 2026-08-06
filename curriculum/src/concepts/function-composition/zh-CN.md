---
title: "组合使用多个函数"
description: "将一个问题拆分成多个相互调用的、职责单一的小函数，这样每个部分都保持简单并可复用。"
en_md5: 7df3110b30c0f279d7f04d3b4e331a99
---

到现在为止，你写的函数基本上都是各自独立的，内部包含了所有需要的逻辑。

现在，我们要看看如何拆分函数，让多个小函数协同工作，而不是用一个臃肿的大函数处理所有事情。

编程中一个通用原则是，每个函数应该做尽可能少的事情。这叫做函数的单一职责（英语：single responsibility）。每个函数只应该做一件事，其他子任务则交给别的函数。

我们来看一个例子。

假设我们有一个函数，它的任务是返回一个描述名字的字符串。

简单的版本如下所示。我们有一个计数的循环——这是你已经写过的——然后一个字符串模板把结果拼接起来。

```javascript
function describeName(name) {
  let length = 0
  for (const letter in name) {
    length += 1
  }
  return `This name is ${length} letters long`
}
```

这段代码能正常工作，但它做了两件事。一件是比较通用的事，数数；另一件非常具体，用特定格式拼出这段字符串。

如果能拆成两个函数就好多了：一个负责计数，另一个负责按这个特定格式描述名字。

```javascript
// 只负责计数字母
function countLetters(str) {
  let count = 0
  for (const letter in str) {
    count += 1
  }
  return count
}

// 只负责格式化文本
function describeName(name) {
  const count = countLetters(name)
  return `The name has ${count} letters`
}
```

这样，我们不仅可以在字符串格式化里复用这个通用的计数功能，还可以在其它任何需要的地方使用它。每当我们需要统计一个字符串里有多少字母时，这个计数功能完全和打印无关。

你可以独立阅读这两个函数，并立刻明白它们各自在做什么。

随着函数越来越复杂、数量越来越多，这个技巧就是决定代码是整洁可读还是一团乱麻的关键。

这里还有一点值得再提一下：你在函数内部创建的任何东西，除非特意用 `return` 返回来，否则其他函数是无法访问的。

所以如果你想在 `describeName`（描述名字）函数内部引用 `count`（计数）这个变量，那是做不到的，因为它属于另一个函数。

<img
  class="concept-image"
  src="/static/images/concept-assets/function-composition/jiki-thinking.webp"
  alt="Jiki 在思考，头上亮着一个灯泡，思考着变量是如何在各个函数中保持私有的"
  width="361"
  height="353"
/>

在 JavaScript 中，我们可以在所有代码的最上面创建变量，让多个函数之间共享，但我强烈建议你不要这样做，除非有非常好的理由。

你让每个函数越独立，专业术语叫纯（英语：pure），也就是纯函数，你的代码就会越干净，产生的 bug 也会越少。
