---
title: "RGB 颜色"
description: "混合红、绿、蓝三色光，从 0 到 255，在屏幕上调出你想要的任何颜色。"
en_md5: 8ed038f6d17072b6fb6eaae6bef15c2c
---

RGB 让我们可以把颜色想象成红、绿、蓝的混合。这就是 RGB 的含义：红色（英语：_red (R)_）、绿色（英语：_green (G)_）、蓝色（英语：_blue (B)_）。如果你还记得在学校里混合颜料，这很类似，只是我们混合的不是涂料，而是光。

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-mixing-circles.webp"
  alt="红、绿、蓝三个光重叠的圆混合形成黄、品红、青、白四种颜色"
  width="500"
  height="390"
/>

在很多练习中，你会遇到一个叫 `rgb(red, green, blue)` 的函数，它接受三个数字作为输入，一个代表红色，一个代表绿色，一个代表蓝色，然后返回一种颜色。

你可以使用的输入数字范围从 0 到 `255`。0 表示我不想要那种颜色，`255` 表示尽可能多地混入那种颜色。所以，如果我们使用 `rgb` 函数，输入 `255`、0 和 0，意思就是我想要全部的红色。记住，`255` 是你能传入的最大数字。但是我们不想要任何绿色或蓝色，所以它们都是 0。于是我们得到了红色，我们可以把红色存到一个变量里，然后用在 `circle` 函数中，就像我们之前处理命名字符串那样。那么如果我们用 `rgb` 函数输入 0、`255`、0 呢？我们现在在说不想要红色，绿色全要，蓝色不要。于是我们得到一个绿色的圆。如果我们想要黄色呢？黄色是红和绿的混合。所以我们可以说：给我全部的红色、全部的绿色，不要蓝色，这样就会得到黄色。我们还可以使用较小的数字。如果我们想要一些红色，不要绿色，很多蓝色，就会得到紫色。很多红色，少许绿色，再多一点蓝色，会得到粉色。这就是 RGB。我们混合红、绿、蓝来得到不同的组合。

```javascript
rgb(255, 0, 0) // 红色
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-red.webp"
  alt="由 rgb(255, 0, 0) 生成的红色圆圈，全部红色，没有绿色和蓝色"
  width="436"
  height="400"
/>

```javascript
rgb(255, 255, 0) // 黄色
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-yellow.webp"
  alt="由 rgb(255, 255, 0) 生成的黄色圆圈，全部红色和全部绿色，没有蓝色"
  width="436"
  height="400"
/>

```javascript
rgb(230, 50, 170) // 粉色
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-pink.webp"
  alt="由 rgb(230, 50, 170) 生成的粉色圆圈，很多红色，少许绿色，还有一些蓝色"
  width="436"
  height="400"
/>

当你想要调整某个特定分量（红色多少、绿色多少、蓝色多少）时，RGB 就非常方便了。
