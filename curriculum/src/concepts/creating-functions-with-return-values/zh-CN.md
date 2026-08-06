---
title: "为函数添加返回值"
description: "使用 `return` 关键字为自己的函数添加一个出料口，将值返回给调用者。"
en_md5: 51d31f709a7051c29b499a31ad68555e
---

现在你已经知道如何创建带输入和不带输入的函数了。还有最后一件事要学，学完之后你就会成为编写函数的专家，那就是：如何为函数添加一个出料口。

你已经使用过许多会返回数据的函数了。`isAlienAbove`（判断外星人是否在上方）会返回给你 `true` 或 `false`。`Math.randomInt(1, 10)`（生成随机整数）会返回给你一个随机数字。

当 Jiki 使用这些函数时，会有什么东西从出料口弹出来，然后他就可以拿去用了。

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/output-chute.webp"
  alt="Jiki 接住从机器出料口弹出的值"
  width="500"
  height="312"
/>

那么为了做到这一点，我们需要另一个新关键字，那就是 `return` 关键字。

`return` 关键字会告诉小型 Jiki 把什么东西从出料口推出去。

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/return-keyword-push.webp"
  alt="小型 Jiki 在机器内部将值 42 通过出料口推出去"
  width="500"
  height="335"
/>

那么我们来创建一个函数吧，把它叫做 `meaningOfLife`（生命的意义）。这个函数的任务仅仅是返回数字 `42`。它没有任何输入。我们这样写：

```javascript
function meaningOfLife() {
  return 42
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/meaning-of-life-42.webp"
  alt="meaningOfLife 机器将数字 42 从它的出料口送出"
  width="500"
  height="323"
/>

现在只要我们在代码中使用 `meaningOfLife()`，就会得到数字 `42`，可以像其他值一样拿来使用。我们可以用 `let` 把它放进盒子里，可以把它作为输入传给其他函数，也可以在 `if` 语句中进行比较。

带返回值的函数也可以接收输入。你可能会编写一个 `ageBracket(age)`（年龄分组）函数，当 `age` 小于 18 时返回 `"Sorry, too young"`，否则返回 `"Welcome"`。无论是谁调用它，都会得到函数返回的那个字符串。

```javascript
function ageBracket(age) {
  if (age >= 18) {
    return "Welcome"
  }
  return "Sorry, too young"
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/age-input.webp"
  alt="将年龄值投入机器的投入口，以便机器决定返回什么"
  width="487"
  height="400"
/>

编程的核心就是这样运作的。我们打造许许多多这样的小型积木，然后把它们拼装成完整的程序。
