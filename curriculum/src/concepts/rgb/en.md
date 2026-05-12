---
title: "RGB Colors"
description: "Mixing red, green, and blue light from 0 to 255 to make any color you want on the screen."
---

RGB lets us think of colors as a mixture of red, green, and blue. That's what RGB stands for: red, green, blue. If you remember mixing paints at school, it's a similar idea, except rather than paint, we're mixing light.

In many exercises, you're gonna have a function called RGB, and it will take three numbers as its inputs, one for red, one for green, one for blue, and it will return out a color.

The numbers that you can use as inputs range from zero to 255. Zero means I don't want any of that color, and 255 means mix as much of that color in as possible. So if we use the RGB function with 255, zero, and zero as our inputs, what we're saying is I want all of the red. Remember that 255 is the largest number you can put in there. But we don't want any green or any blue, so those are both zero. So we get red out, and we can store that red in a variable and then use it in the circle function just like we've been doing with the named strings already. So what about if we use the RGB function with zero, 255, zero? We're now saying no red, all the green, no blue. So we get a green circle. What about if we want yellow? So yellow is a mixture of red and green. So we can say give me all of the red, all of the green, and no blue, and that will give us yellow. And we can use smaller numbers. So if we want some red, no green, and lots of blue, we'll get purple. And lots of red, a little green, a little more blue, that gives us a pink. So that's RGB. We mix red, green, and blue to get different combinations.

RGB is great when you want to adjust one specific component, how much red, how much green, how much blue.
