---
title: "if 语句"
description: "用 `if` 关键字让代码在某个条件为真的情况下才运行一段代码，就像门卫放人进去一样。"
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

有个关键字可以帮我们告诉 Jiki 只在特定情况下做事情。比如你写了一段看守酒吧入口的代码，你是个门卫，只有当来人的穿着得体时 Jiki 才开门。又比如你在写一段负责在比赛终点挥动方格旗的代码，但你需要让 Jiki 知道只能在最后一圈挥旗。在这些情况下，我们就要用到 `if` 关键字。

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="扮演门卫的 Jiki 在决定是否让人们进入夜总会"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="准备在比赛终点挥动方格旗的 Jiki"
  width="266"
  height="400"
/>

我们使用 `if` 关键字的方式和 `repeat` 关键字非常相似。我们在普通的括号里放一些信息。在这里，这些信息就是我们要检查的条件（英语：condition）。然后我们在花括号里写一段代码，只有当那个条件为真的时候才会运行。

```javascript
if (condition) {
}
```

那这些条件长什么样呢？嗯，它们通常是一种比较（英语：comparison）。我们比较两个数字或者两个字符串，看看结果是真还是假。

所以，可以把它想象成能大声说出来的判定（英语：statement）。3 小于 5，这是真的。7 小于 2，这是假的。

我们用符号来写这些比较。你可能在数学里就已经熟悉它们了。我们有小于、大于、小于等于、大于等于，还有一个用来检查两个东西是不是一样的，也就是它们是否相等。而这个跟你以前见过的方式可能有点不一样，因为我们用三个连续等号来判断两个东西是不是相同或者不同。

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="一张比较运算符的表格：小于、大于、小于等于、大于等于、相等、不相等，并附有示例"
  width="449"
  height="400"
/>

这样我们就不会把它和设置或更新变量时搞混了——那时我们用一个等号表示把某个东西放进盒子里。记住，三个等号用来做比较。

你也可以比较字符串。所以 `"hello"` 等于 `"hello"`，这是真的，两个字符串一样。但这里要当心，因为 Jiki 会比较两张纸上两个字符串里的每一个字符（英语：character）。所以大写 H 开头的 `"Hello"` 不等于小写 h 开头的 `"hello"`，它们是不同的字符串。所以比较它们的结果会是假，因为大写 H 和小写 h 是不同的字符。

另外，顺便说一下，真和假叫做布尔（英语：Boolean），这又是一个听起来很技术的词。但其实非常简单，它只是表示某个东西要么为真要么为假的另一种正式说法。所以如果你遇到“布尔”这个词，它就是真或假的意思。我们来看一个实际的例子。假设我们要给一家夜店造一个机器人门卫，我们规定门卫只在来人的年龄大于或等于 21 岁时才开门。所以我们有一个 `askAge`（询问年龄）的函数，可以用它来获取某人的年龄，我们把它的返回值存到一个叫 `age`（年龄）的变量里。然后我们可以说，如果这个 `age` 大于 20，就开门。所以如果 `askAge` 返回 `30`，我们就开门；如果返回 `12`，就不开。

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki 为年龄足够的人开门，并拒绝太年轻的人入场"
  width="410"
  height="400"
/>
