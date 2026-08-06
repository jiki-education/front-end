---
title: "`not` 运算符"
description: "使用 `!` 翻转布尔值：true 变为 false，false 变为 true，常用于切换或反转检查。"
en_md5: 842c4a4e9cb1fd11c4318a1508296e27
---

到目前为止，当我们比较两个事物是否相等时，我们使用了三个等号。但有时候，我们想要检查它们是否不相等，这时就需要使用一个感叹号加上两个等号。在编程中，感叹号（英语：bang），我们的美国朋友好像这么叫它，通常表示“非”。想象一下，你在商店工作，管理者规定任何迪斯科风格的服装都不允许进入。

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/shop-bouncer.webp"
  alt="商店门前检查排队人群着装的保安"
  width="451"
  height="400"
/>

我们可以说：“如果服装不是迪斯科，就开门。”`if` 语句的工作方式完全一样。

```javascript
if (outfit !== "disco") {
  openDoor()
}
```

实际上，当两个事物不同时，这个条件返回 `true`；相同时返回 `false`。我们也可以换种写法，说：“如果服装是迪斯科，什么都不做。否则，开门。”但通常，使用 `not` 运算符（英语：operator）会更简单、更清晰，能直接表达出你的意思。

与此相关的还有一个用法。有时你有一个值为 `true` 的变量，想把它翻转为 `false`；或者某个值为 `false` 的变量，想翻转为 `true`，我们可以用这个来跟踪状态。假设有一个东西从左边弹到右边，我们有一个变量叫 `movingRight`（向右移动），当应该向右移动时它为 `true`。但当我们碰到右边缘时，想要把它切换（英语：toggle）为 `false`。

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/pong-court.webp"
  alt="一个乒乓球式场地，有球拍和一个球从左右两侧弹跳，用来演示如何切换 movingRight 变量"
  width="500"
  height="352"
/>

我们可以这样写：“如果 `movingRight` 等于 `true`，那么 `movingRight` 等于 `false`。否则，`movingRight` 等于 `true`。”这是一种切换变量的方法。Jiki 会查看 `movingRight` 盒子里的值是 `true` 还是 `false`，然后计算出相反的值，再放回盒子里。

```javascript
if (movingRight === true) {
  movingRight = false
} else {
  movingRight = true
}
```

不过还有一种更简洁的方法，就是使用同样的感叹号（bang）：

```javascript
movingRight = !movingRight
```

这行代码就能翻转它。`!movingRight` 表示与它之前的值相反。

所以，如果 `movingRight` 原来是 `true`，现在就变成了 `false`；如果原来是 `false`，现在就变成了 `true`。Jiki 拿到盒子当前的值，那个感叹号告诉他找到相反的值。`true` 的相反是 `false`，`false` 的相反是 `true`，然后他把相反的值放回盒子里。这和那个更长的 `if/else` 语句完全一样，只是写起来更简洁、更精练。
