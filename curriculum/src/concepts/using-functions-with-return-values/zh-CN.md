---
title: "有返回值的函数"
description: "捕获从函数出料口弹出的值，并在你的代码中使用它。"
en_md5: 830f19fb6aaf184c1f32ade792b60a12
---

到目前为止，我们看过的函数都是在“世界”里做某件事。比如 `circle`（画圆）函数画一个圆，`move`（移动）函数移动你的角色。但有些函数的工作方式不同。它们不是对外界做什么，而是返回某个东西给你，让你能在自己的代码里用。当一个函数把某个东西返回给 Jiki，让他能在代码里用，我们就说这个函数在返回（英语：_returning_）某个东西。它把某个东西返还给 Jiki。你可以把这些机器想象成有一个出料口。我们已经有投入口，能把东西放进去，但我们也可以有一个单一的出料口，让东西能从里面返回来。当 Jiki 按下机器上的按钮，机器嗡嗡运转，最后那个东西就会从出料口弹出来。它可能是一个数字。也可能是一个字符串。它是 Jiki 可以接住并且使用的东西。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/machine-with-return-chute.webp"
  alt="一台侧面有出料口的机器，准备把值返回给 Jiki"
  width="500"
  height="317"
/>

大部分函数，大概 95% 吧，都会返回东西。它们可能会帮你做一些数学计算，然后返回结果值；也可能会把几个字符串拼接在一起，然后把得到的字符串给你。或者，每次你运行那台机器，它都会把当前的时间返回给你。我们来看看最后这种。假设我们有一个函数叫 `getCurrentTime`（获取当前时间）。每次 Jiki 运行这台机器，都会有一张写着时间的纸从出料口滑出来，比如 14:35。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/paper-out-of-chute.webp"
  alt="getCurrentTime 机器，一张写着 14:35 的纸正从出料口滑出"
  width="500"
  height="312"
/>

然后我们可以用 `let` 把那个返回值放进一个盒子里：

```javascript
let time = getCurrentTime()
```

Jiki 会运行这台机器，从出料口拿到当前时间，然后把它存进一个叫 `time` 的盒子里。

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/jiki-boxing-time.webp"
  alt="Jiki 正把写着 14:35 的纸从出料口放进一个贴着 time 标签的盒子里"
  width="372"
  height="400"
/>

现在，很重要的一点是：Jiki 放进盒子里的那张纸，在那一刻是固定的。即使你的程序运行期间，实际的时间又变了，那个盒子里装的也还是写着 14:35 的那张纸。一旦东西放进了盒子，它就是里面一个固定的东西了。它不会神奇地自己变。如果我们以后想再把当前的时间放进盒子，就需要再用一次 `getCurrentTime` 函数来拿到它。

大多数会返回东西的函数也有输入。比如，我们可能有一个 `join`（拼接）函数，它接受两个字符串作为输入，然后返回一个用空格把两者接在一起的新字符串。所以，如果我们往 `join` 机器里放 `"Hello"` 和 `"World"` 作为输入，从出料口出来的就会是写着 `"Hello World"` 的一个字符串。

```javascript
join("Hello", "World"); // "Hello World"
```
