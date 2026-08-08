---
title: "随机数"
description: "使用 `Math.randomInt` 并指定最小值和最大值，每次函数运行都能得到一个不同的数字。"
en_md5: 5f41de1ca5327be4a86a69d801f1b6f9
---

在编程中，我们经常希望使用某个函数，每次都能返回一个不同的随机数（英语：random number）。

这在很多场景下都很有用，尤其是在密码学中，我们要做很多类似在机器之间共享密码的事情，而这些密码必须是随机的，以免被破解。

为此，给你提供了一个可用的函数，名为 `Math.randomInt`（数学·随机整数）。你可能注意到中间有个点。当你接触到更多函数时，我们可以把它们组织成不同的组别，以便保持整洁，而 `Math`（数学）这一部分就是这个函数所属组的名称。它告诉 Jiki 应该在货架的哪个区域寻找，在这个例子中就是 `Math` 区域。点号仅仅表示进入这个区域找到函数。现在不用太担心。练习题说明总是会告诉你有哪些函数可用以及如何使用它们。重要的是要理解，当 Jiki 使用这个函数时，每次运行都会返回一个不同的数字，但有一个约束条件。该函数有两个输入。第一个是允许这台机器返回的最小数字，第二个是允许返回的最大数字。所以如果你用 `Math.randomInt` 函数并传入 `10` 和 `13`，你将总能得到 `10`、`11`、`12` 或 `13` 之一。但每次得到的都会不同。

<img
  class="concept-image"
  src="/static/images/concept-assets/random/jiki-shelves-math.webp"
  alt="Jiki 爬上梯子，前往仓库货架的 Math 区域"
  width="440"
  height="400"
/>

```javascript
Math.randomInt
```

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-two-inputs.webp"
  alt="顶部有两个输入漏斗的 Math.randomInt 机器"
  width="500"
  height="378"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-10-13.webp"
  alt="输入漏斗中放入了 10 和 13 的 Math.randomInt 机器，输出 10、11、12 或 13"
  width="488"
  height="400"
/>

那么，假设你想在画布上随机位置画一个圆。你可以使用 `Math.randomInt` 来随机获取 `left` 和 `top` 的不同值，但比如限制在 `10` 和 `90` 之间，这样它们不会重叠，也不会超出画布。每次运行这段代码时，圆圈都会画在稍微不同的位置。
