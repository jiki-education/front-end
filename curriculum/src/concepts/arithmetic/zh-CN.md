---
title: "算术"
description: "将变量与数学相结合，让值能通过加、减、乘、除彼此关联、相互依赖。"
en_md5: 7ce54754a3ca29896609a01a51b12377
---

到目前为止，我们创建变量时只是用了简单的值；比如一个像 `50` 这样的数字，或者像 `"yellow"` 这样的字符串。变量真正变得强大的地方，是我们可以将它们彼此组合使用。比如，我们可以说，矩形的左边距应该离画布边缘一段特定的距离。

在编程中，我们可以使用普通的基础数学，比如加、减、乘、除，并且我们可以把已经设好的变量作为其中的一部分。

我们先假设要在画布上画一个矩形，希望它距离左右两边各 10，距离上下两边各 20。这样它就会处于画布中央，长度比高度稍微长一点。

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/rectangle-on-canvas.webp"
  alt="一个蓝色矩形居中于画布上，离左右各 10，离上下各 20"
  width="399"
  height="400"
/>

画矩形时，我们需要知道它的 `left`（左边距）、`top`（上边距）、`width`（宽度）和 `height`（高度），还有它的颜色。我们可以从把这些写出来开始。

现在我们需要实际算出它的 `left`、`top`、`width` 和 `height` 应该是多少。所以来设置它们吧。`left` 是 10。`top` 是 20。`width` 呢，就是画布的尺寸 100，减去左边的 10 和右边的 10，所以是 80。而 `height` 就是画布高度 100，减去顶部的 20 和底部的 20，也就是 60。

```javascript
let left = 10
let top = 20
let width = 80
let height = 60

rectangle(left, top, width, height, "blue")
```

这样我们就能设置好这些变量。`left` 为 10，`top` 为 20，`width` 为 80，`height` 为 60。但如果我们想把矩形往里面挪一点，让它稍微小一点呢？如果想让它离左右各 20，离上下各 30 呢？那么我们又得把一切重新算一遍。现在的 `width` 就成了 100 减 20 再减 20，`height` 是 100 减 30 再减 30，这肯定比我愿意做的计算要多。所以，我们可以让计算机替我们算。

我们可以把 `width` 设为 100 减 `left` 再减 `left`，把 `height` 设为 100 减 `top` 再减 `top`，因为上下距离相等。或者，我们也可以写成 100 减 `left` 乘 2，或者 100 减 `top` 乘 2。

```javascript
let width = 100 - left * 2
let height = 100 - top * 2
```

现在，如果我们改变 `left` 或 `top`，`width` 和 `height` 也会跟着变化。这样一来，各项事物就开始相互关联了。那画布呢？目前它是 100。可如果画布的宽高变成了 200 呢？那么，我们或许应该设置一个叫 `canvasSize`（画布尺寸）的变量，并把它设为 100。现在，我们的 `width` 就成了 `canvasSize` 减 `left` 乘 2，`height` 则是 `canvasSize` 减 `top` 乘 2。

```javascript
let canvasSize = 100
let left = 20
let top = 30
let width = canvasSize - left * 2 // 60
let height = canvasSize - top * 2 // 40

rectangle(left, top, width, height, "blue")
```

让我们想想，当我们写 `let height = canvasSize - top * 2` 的时候，Jiki 在做些什么。嗯，他先从货架上拿下 `top` 盒子，发现里面是 30，然后掏出他的口袋计算器算出 30 乘 2 得 60，在心里记下这个 60。

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-1.webp"
  alt="Jiki 把 top 盒子从货架上拿下来，算出 30 乘 2 等于 60"
  width="377"
  height="400"
/>

接着，他又从货架上拿下 `canvasSize` 盒子，发现里面是 100，然后算出 100 减 60 等于 40。现在他明白了，我们实际上是在说“让 `height` 等于 40”。于是他遵照 `let` 的指令，拿一个新盒子在上面写上 `height`，然后把 40 放进去。之后，当他再使用 `height` 时，就直接把 40 取出来用了。

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-3.webp"
  alt="Jiki 取出一个新盒子，在上面写上 height，然后把 40 放进去"
  width="462"
  height="400"
/>

当你在练习中把一切都调通之后，试着改动一下变量的值，看看会发生些什么。观察它们如何变大，又如何缩小。慢慢来，体会事物之间的关系。
