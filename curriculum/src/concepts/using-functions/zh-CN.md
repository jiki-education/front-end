---
title: "使用函数"
description: "写下机器的名字，后面加上一对括号，就能让 Jiki 运行他的一台小机器。"
en_md5: fc671310093a081113a8f301b6ff53fe
---

写代码，其实就是用计算机能听懂的语言，把你想让它做的事情表达出来。编程语言有很多种，把你写的代码变成计算机能懂的 1 和 0 的翻译（英语：interpreter）也有很多种。在这门课里，你的翻译就是 Jiki。整门课的名字也来自 Jiki。这就是 Jiki。在这段编程旅程中，Jiki 会是你的朋友。他的工作就是翻译你写的代码，把它变成计算机真正能执行的 1 和 0。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki，这门课里陪你一路前行的友好的翻译"
  width="421"
  height="400"
/>

编程的核心，就是给翻译（这里就是 Jiki）下正确的指令。你能给 Jiki 下的指令有很多，他能听懂的也有很多。他可以把东西拼接起来，可以把一件事重复做很多次，也可以判断“如果发生了这件事，那我就要做那件事”。他可以记住一些东西，之后再拿出来用。如果哪里不对，他会给你一个错误（英语：error）。这些内容我们都会在这门课里讲到。但最关键的一点是：你接下来做的所有事情，都是把指令写在白板上，让 Jiki 过来照着一条条执行。

34 年前我学编程的时候，脑子里建立的就是这个画面，到今天还是这个画面。计算机的工作原理我一直理解到 1 和 0 那一层，但说实话，我几乎从来不去想那些。在我的想象里，计算机里住着一个角色，我告诉它该做什么。所以请跟着我一起这样想。这是一个很有力的思维模型，一旦你开始用这种非常具象的方式去想“计算机里的那个人正在做什么”，在学编程的路上它会帮你很多。

那我们就从编程中最基础的概念之一开始：函数（英语：function）。函数就像一台台你可以让 Jiki 使用的小机器。我们去 Jiki 的仓库里看看，他平时就待在那儿，你会看到那里有一个货架，上面放着三台机器：`move`（移动）、`turnLeft`（向左转）和`turnRight`（向右转）。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Jiki 仓库里的一个货架，上面放着三台机器，分别标着 move、turnLeft 和 turnRight"
  width="500"
  height="371"
/>

当你写下`move`，后面再加上那对括号时，你其实是在告诉 Jiki：去货架上把`move`机器搬下来，转动摇柄，让它通上电，然后使用它。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki 把 move 机器从货架上推下来准备使用"
  width="439"
  height="400"
/>

当你写下`turnLeft`再加上括号时，你就是在告诉 Jiki 把`turnLeft`机器从货架上搬下来使用。这个写法你会一遍又一遍地用到。每当你想使用一台机器，就写下它的名字，后面加上那对括号，这就是在告诉 Jiki 去把机器搬过来使用：

```javascript
move()
turnLeft()
```

至于这台机器到底是怎么工作的，它内部发生了什么，现在还不用操心。后面我们会讲得详细得多。事实上，很快你就能自己造机器了。但现在先别管这些。每个练习都会告诉你 Jiki 的货架上有哪些机器。不同练习上面的机器不一样，你可以用这些机器来解决练习。
