---
title: "Repeat 循环"
description: "使用 `repeat` 关键字告诉 Jiki 把花括号里的代码运行指定次数。"
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

到目前为止，所有指令都是线性编写的，Jiki 从上到下依次执行每一条指令。

现在我们将看看 Jiki 如何打破这种严格从上到下的流程，特别是如何让 Jiki 连续多次运行同一段代码。

例如，想象一下你在迷宫里，你想向前走 10 步。有一个 `walk` 函数可以帮助你，但如果没有它呢？如果你只有 `move`（移动）函数呢？

与其连续写 10 次 `move`（这很重复），我们需要能够说：“嘿，Jiki，把我接下来说的事情做 10 次。`Move`。”

要在代码中做到这一点，我们需要使用第一个关键字（英语：_keyword_），关键字是 Jiki 理解的指令。它们看起来有点像机器，但它们不是。当 Jiki 看到一个关键字时，他不会在货架上找机器，他直接就知道该做什么。这已经内置在他的大脑里了。我们将在课程中学习大约 20 个不同的关键字，第一个就是 `repeat` 关键字。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki 被 repeat、if、else、and、or 等关键字包围，并附注关键字是 Jiki 能理解的指令"
  width="358"
  height="400"
/>

`repeat` 关键字正是我上面说的作用。它告诉 Jiki：“把我接下来说的话重复这么多次。”看看这段代码。首先，我们使用 `repeat` 关键字告诉 Jiki 他要多次做某件事。然后我们在普通的圆括号里写上你希望 Jiki 重复的次数，接着是花括号，也就是大括号，花括号里面是我们希望 Jiki 重复的内容。现在，这种模式在编程中非常普遍。我们指定一个关键字，通常附带一些信息，比如这里要做的次数，然后一个代码块（英语：_code block_）放在花括号里。回到迷宫世界，与其写 `move`、`move`、`move`、`move`，我们可以写重复四次 `move`。

```javascript
repeat(4) {
  move()
}
```

Jiki 看到这段代码，他会连续四次使用 `move` 机器。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki 连续使用 move 机器四次，一个接一个"
  width="421"
  height="400"
/>

而且，花括号里也不只能有一件事。Jiki 也可以重复做多件事。我们可以告诉 Jiki `move`，然后 `turnLeft`，把这一整套重复四次。如果 Jiki 看到这段代码，他会先使用 `move` 机器，再使用 `turnLeft` 机器，然后又是 `move` 机器，再 `turnLeft` 机器，以此类推，直到每样都做了四次。

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki 使用 move 机器，然后使用 turnLeft 机器，把这对动作重复四次"
  width="500"
  height="390"
/>

我们把这些重复指令叫做循环（英语：_loop_），还有很多种不同的循环，它们的工作方式都略有不同。

还有一件事要知道，那就是在处理循环时，保持代码整洁变得至关重要。当你的代码有良好的视觉结构时，很容易看清发生了什么。但如果不这样，如果你忘了正确缩进或者把缩进搞混了，事情会很快变得混乱。所以在课程中，我们有一条规则。你总是把起始花括号放在 `repeat` 语句（英语：_statement_）的同一行。你总是把结束花括号单独放在语句下面一行，并且你总是将花括号之间的代码缩进两个空格。这样一切都会保持非常整洁，如果你忘记了或者试图采用其他格式，就会出错。

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki 指着保持循环代码块整洁的缩进和新行"
  width="500"
  height="398"
/>
