---
title: "Random Numbers"
description: "Using `math.randomint` with a minimum and maximum to get a different number each time the function runs."
---

Often in programming, we want to use a function and get a different random number back every time.

This is useful in all sorts of ways and places, but especially in cryptography, where we're doing a lot of things like creating codes to share between machines, and those codes need to be random so they can't be hacked.

To help with this, you have a function available called `math.randomint`. You might notice there's a dot in the middle of that. As you get access to more functions, we can organize them into different groups to keep things tidy, and the math bit is a name of a group that this function belongs to. It tells Jiki which section of the shelves to look on, in this case, the math section. The dot just means go to this section and find the function. Don't worry about this too much for now. The exercise instructions will always tell you what functions are available and how to use them. The important thing to understand is that when Jiki uses this function, it will give him a different number each time he runs it, with one constraint. The function has two inputs. The first is the smallest number the machine is allowed to return, and the second is the largest number the machine is allowed to return. So if you use the `math.randomint` function with 10 and 13, you'll always get 10, 11, 12, or 13 back out again. But you'll get a different one each time.

So let's imagine you want to draw a circle at a random position on the canvas. You can use `math.randomint` to get different values for the left and top randomly each time, but with boundaries of, say, 10 and 90, so they never overlap and go outside the canvas. Every time you run this code, the circle's gonna be drawn in a slightly different place.
