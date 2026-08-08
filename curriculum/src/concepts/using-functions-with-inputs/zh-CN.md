---
title: "函数输入"
description: "将值放入函数的投入口，以改变它每次运行时的行为。"
en_md5: 0bd82377f2407de5fe030511752d5503
---

函数，或者说机器，比较强大的一点是，很多函数允许你放入一些信息，当你运行它的时候，这些信息会改变它要做的事情。

到目前为止，我们见到的机器看起来有点像盒子，比如 `move`（移动）这个机器。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/move-machine.webp"
  alt="move 机器，一个没有投入口的普通盒子"
  width="322"
  height="400"
/>

但有些机器，它们有投入口，比如这个 `walk`（走）机器。`walk` 机器和 `move` 机器很像。它让角色（英语：_character_）向前移动，只不过 Jiki 可以用投入口来指定你的角色应该向前走多少步。所以，与其连续使用三次 `move` 函数，`move`、`move`、`move`，不如你直接使用 `walk` 函数，并告诉 Jiki 把数字 3 放入机器。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/walk-machine-slot.webp"
  alt="walk 机器，顶部有一个用于指定步数的投入口"
  width="481"
  height="400"
/>

在代码里，我们依然要写出函数的名字，这里就是 `walk`，也依然要写上左括号。但在写右括号之前，我们先说出我们希望输入（英语：_input_）是什么。在这里，我们希望输入是 3，意思是 `walk` 三步：

```javascript
walk(3)
```

当 Jiki 看到这行代码，他会拿到数字 3，你可以把这个数字想象成一个小硬币，然后他会把它放进机器的投入口，再转动摇柄来启动机器。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/jiki-coin-into-slot.webp"
  alt="Jiki 像投硬币一样把数字 3 放入 walk 机器的投入口，然后摇动摇柄"
  width="421"
  height="400"
/>

对于绘制矩形和圆形的函数，你需要告诉 Jiki 放入多个不同的数字，来指定它距左边多远、距顶部多远、矩形的宽度、矩形的高度。

在 Jiki 的世界里，这些信息只是不同的投入口，每个数字对应一个投入口。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/two-machines-inputs.webp"
  alt="矩形机器，有 left、top、width、height 四个投入口；圆形机器有 cx、cy、radius 三个投入口"
  width="396"
  height="400"
/>

所以，在代码里，我们只需依次写出每个数字，中间用逗号隔开。写出函数名、一个括号、每个输入对应的数字，用逗号分隔，然后关上括号：

```javascript
rectangle(10, 20, 30, 40)
```

如果你尝试用一个函数，但给出了错误数量的输入，你就会遇到错误。比如，如果你把输入放进一个没有投入口的机器，Jiki 会告诉你不能这么做。或者，如果你使用一个有投入口的机器，但又没告诉 Jiki 该放什么进去，他也会停下来抱怨。如果你有点叛逆的话，不妨试试看会发生什么。当事情变得更复杂时，你可能会犯很多这样的错误。尽量不要为此感到紧张或沮丧。我们都是通过犯错来学习的，这实际上是我们大脑真正掌握东西最快的途径。每个人都会犯这些错误，我们都从零开始，所以别紧张。

还有一点值得一提：有时，在练习里你会看到以两个斜杠 `//` 开头的行。这些行被称为注释（英语：_comments_）。它们是只给你看的私人笔记，Jiki 会完全忽略它们。所以，如果 Jiki 看到以这两个斜杠开头的行，他会直接跨过去，继续处理下一行。通过注释，你可以写下给自己的笔记，这对于提醒你一些东西如何工作非常有帮助。很多时候，注释也是为帮你而写好的，比如当你开始一个练习时，它可能会提示你需要在何处写代码，或如何解决某个问题。当然，你完全可以自由添加你自己的注释。

在每个练习说明的最底部，你会看到关于你可以使用的函数的信息，里面会明确写出你需要放入的输入是什么。
