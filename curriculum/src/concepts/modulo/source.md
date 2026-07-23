---
title: "Remainder"
description: "Using the `%` operator to get what's left over after division, often used to check if a number is even or odd."
---

So far, we've used addition, subtraction, multiplication, and division for when we're doing arithmetic. Now we're gonna introduce one more, the <define>remainder</define> operator.

The remainder operator is responsible for giving you the remainder, logically, when you divide two numbers, and we write it using a percentage sign. So if we write `10 % 4`, we're saying or we're asking, "What's left over when we divide 10 by 4?" And the answer is two. Imagine you've got 10 sweets or nuts, and you want to share them equally between four people. Each person gets two, and then there's two left over at the end. And that left over bit, that's the remainder. That's what this percentage sign gives you.

<img
  class="concept-image"
  src="/static/images/concept-assets/modulo/sharing-candies.webp"
  alt="A row of ten sweets being shared equally between four people, with two left over as the remainder"
  width="500"
  height="22"
/>

```javascript
10 % 4
```

One of the reasons that we use this quite regularly in code is that we can know whether something divides equally or not, and the most common pattern you'll see with that is working out if we have an even or an odd number. Even numbers, as you know, all divide equally by two. Odd numbers all have one left over when you divide by two.

So if you take four or six or eight, if you can divide them by two, they all have nothing left over, whereas five and seven and nine, if you divide them by two, there's all one left over at the end. So by writing `if something % 2 === 0`, we're saying, "Is this something an even number?" And that can be useful for tons of things. Imagine creating stripes with different colors or splitting a queue in half, sending each person one of two ways as they walk towards you.

One thing to note, you might hear people refer to this remainder keyword as the modulo operator. Modulo and remainder are basically identical. There are some slight differences that you don't need to worry about probably ever, so we'll think of it as the remainder operator for now, as that's just much easier.
