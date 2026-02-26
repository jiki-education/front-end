---
title: "Sprouting Flower"
description: ""
---

Your task is to make a flower that grows over 60 iterations.

The key to this exercise is to build relationships between the different elements. This is a key skill in programming.

## How to solve it

The key component of this is the center of the flower. Everything else can be calculated off that center point. On each iteration of the loop, the center point should move up by 1 (before drawing).

Here are some other things you need to know:

- The top-left of the drawing canvas is 0,0. The bottom-right is 100,100.
- The radius of the flower starts at 0 and should increase by 0.4 on each iteration (before drawing)
- The radius of the pistil (the middle yellow bit of the flower) starts at 0 and should increase by 0.1 on each iteration (before drawing).
- The stem should start at the center of the flower and reach the ground.
- The stem's width is 10% of the stem's height (so stemHeight / 10).
- Everything is centered on the horizontal axis.
- The leaves sit flush against the stalk on each side.
- The leaves sit half way down the stem.
- The xRadius of the leaves is 50% the radius of the flower.
- The yRadius of the leaves is 20% of the radius of the flower.

It is essential to work on one thing at a time:

- Start by drawing the pink flower and getting it to move up.
- Then get it to grow.
- Add the smaller yellow center.
- Add the stem.
- Add the left leaf.
- Add the right leaf.

Use the scrubber bar to scroll through the code and work out where things are going wrong.
