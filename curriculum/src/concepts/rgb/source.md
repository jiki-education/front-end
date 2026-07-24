---
title: "RGB Colors"
description: "Mixing red, green, and blue light from 0 to 255 to make any color you want on the screen."
---

<literal>RGB</literal> lets us think of colors as a mixture of red, green, and blue. That's what <literal>RGB</literal> stands for: <define en="red (R)">red</define>, <define en="green (G)">green</define>, <define en="blue (B)">blue</define>. If you remember mixing paints at school, it's a similar idea, except rather than paint, we're mixing light.

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-mixing-circles.webp"
  alt="Three overlapping circles of red, green, and blue light mixing to make yellow, magenta, cyan, and white"
  width="500"
  height="390"
/>

In many exercises, you're gonna have a function called `rgb(red, green, blue)`, and it will take three numbers as its inputs, one for red, one for green, one for blue, and it will return out a color.

The numbers that you can use as inputs range from zero to `255`. Zero means I don't want any of that color, and `255` means mix as much of that color in as possible. So if we use the `rgb` function with `255`, zero, and zero as our inputs, what we're saying is I want all of the red. Remember that `255` is the largest number you can put in there. But we don't want any green or any blue, so those are both zero. So we get red out, and we can store that red in a variable and then use it in the `circle` function just like we've been doing with the named strings already. So what about if we use the `rgb` function with zero, `255`, zero? We're now saying no red, all the green, no blue. So we get a green circle. What about if we want yellow? So yellow is a mixture of red and green. So we can say give me all of the red, all of the green, and no blue, and that will give us yellow. And we can use smaller numbers. So if we want some red, no green, and lots of blue, we'll get purple. And lots of red, a little green, a little more blue, that gives us a pink. So that's RGB. We mix red, green, and blue to get different combinations.

```javascript
rgb(255, 0, 0)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-red.webp"
  alt="A red circle produced by rgb(255, 0, 0), all red and no green or blue"
  width="436"
  height="400"
/>

```javascript
rgb(255, 255, 0)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-yellow.webp"
  alt="A yellow circle produced by rgb(255, 255, 0), all red and all green with no blue"
  width="436"
  height="400"
/>

```javascript
rgb(230, 50, 170)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-pink.webp"
  alt="A pink circle produced by rgb(230, 50, 170), lots of red, a little green, and some blue"
  width="436"
  height="400"
/>

RGB is great when you want to adjust one specific component, how much red, how much green, how much blue.
