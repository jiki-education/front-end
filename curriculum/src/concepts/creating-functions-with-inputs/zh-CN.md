---
title: "给函数加上输入"
description: "为你自己的函数添加投入口，让它们能够根据传入的值做出不同的操作。"
en_md5: f70d737888fcbda3306196ff069eb2f1
---

你目前为止创建的函数，每次都做完全相同的事情。`turnAround`（转身）总是向左转两次。`shootIfAlienAbove`（检查上方并射击）总是检查并射击。

但回想一下你在整个课程中一直在使用的函数，它们会根据输入做出不同的事情。`Rectangle` 接受左边距、顶部距离、宽度、高度作为输入，然后根据你告诉它的值画出不同的矩形。

现在，我们也要给你的函数加上投入口。

要做到这一点，你需要知道两件事。第一是实际上看起来是什么样，也就是你需要写什么；第二是实际上发生了什么。

第一部分非常简单。你只需要加上一对普通的括号，然后写上你想要的输入的名字。

所以，想象一下我们要创建一个能多次射击的函数。我们就叫它 `shootMany`（多次射击）。

我们会这样写它：

```javascript
function shootMany(numShots) {
  // ...
}
```

当你想使用这个函数时，你会用想要射击的次数来调用它：

```javascript
shootMany(5)
shootMany(2)
```

现在，这是最关键的部分。当代码运行时，无论你在那个输入里放进什么，比如 `5` 或 `2`，在函数内部戴着帽子的迷你 Jiki 会把那个输入接过来，放进一个叫 `numShots`（射击次数）的盒子里，然后把那个盒子放到函数内部的货架上，供你在函数代码中使用。

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-box.webp"
  alt="迷你 Jiki 在 shootMany 机器内部，将输入放入一个标有 numShots 的盒子里"
  width="500"
  height="376"
/>

我再解释一遍。

当我们写 `shootMany(5)` 来使用这个函数时，外面的 Jiki 去拿一个 `5`，把它放进 `shootMany` 的投入口。在机器内部，迷你 Jiki 把这个 `5` 取出来，放进一个叫 `numShots` 的盒子里，因为那是你给那个投入口起的名字，然后他把这个盒子放到机器里函数内部的货架上。

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-on-shelf.webp"
  alt="迷你 Jiki 把 numShots 盒子放到 shootMany 机器内部的货架上"
  width="500"
  height="302"
/>

然后，在函数内部，你就可以像使用其他盒子一样使用 `numShots` 盒子。`numShots` 这个名字没有任何神奇之处。我们可以给它起任何名字。它只是一个指令，告诉迷你 Jiki 始终在函数内部创建一个带有那个标签的盒子，然后把传入那个投入口的任何东西放进那个盒子。

一旦盒子里有了一个值，你就可以像平常使用盒子那样做任何事情。你可以把 `numShots` 盒子用在重复循环里，射击正确的次数。你也可以有多个输入。用逗号把它们分开就行。所以，如果我们有一个叫 `drawStar`（画星星）的函数，它能根据左上角位置画一个星星，你会这样写：

```javascript
function drawStar(left, top) {
  // ...
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-two-slots.webp"
  alt="drawStar 机器有两个投入口，接收两个独立的值"
  width="453"
  height="400"
/>

然后，当这个函数被调用时，迷你 Jiki 会把传入输入的值存进名为 `left`（左边距）和 `top`（顶部距离）的盒子里，然后把这些盒子放到函数内部的货架上。

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-boxes-shelf.webp"
  alt="迷你 Jiki 把两个输入存进标有 left 和 top 的盒子里，放在 drawStar 机器内部的货架上"
  width="431"
  height="400"
/>
