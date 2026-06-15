---
title: "Sprouting Flower"
description: "Use variable relationships to animate a flower growing from the ground."
---

Your task is to make a flower that grows over `60` iterations.

The animation should look something like this.

<img src="/static/images/exercise-assets/sprouting-flower/frames.webp" alt="Frames showing a flower growing from the ground over 60 iterations" style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

The key to this exercise is to build relationships between the different elements. This is a key skill in programming.

**Before reading any more of the instructions**, take a few minutes to work out conceptually how to achieve this. Write down the steps you think you need to follow on a piece of paper.

**Once you've got a solution** you're happy with (or given up), **scroll down** to see the instructions.

---

## How to solve it

The key component of this is the center of the flower. Everything else can be calculated off that center point. On each iteration of the loop, the center point should move up by `1` (before drawing).

Here are some other things you need to know:

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- The radius of the flower starts at `0`. It should increase by `0.4` on each iteration (before drawing).
- The radius of the pistil (the middle yellow bit of the flower) starts at `0`. It should increase by `0.1` on each iteration (before drawing).
- The stem should start at the center of the flower and reach the ground.
- The stem's width is 10% of the stem's height (so `stemHeight / 10`).
- Everything is centered on the horizontal axis.
- The leaves sit flush against the stalk on each side.
- The leaves sit halfway down the stem.
- The `xRadius` of the leaves is 50% of the radius of the flower.
- The `yRadius` of the leaves is 20% of the radius of the flower.
- The flower head can be `"red"` or `"pink"` depending on your taste. The pistil (the flower center) should be `"yellow"`. The grass should be `"green"`. The background should be `"skyblue"`.

It is **essential** to work on one thing at a time:

- Start by drawing the pink flower and getting it to move up.
- Then get it to grow.
- Add the smaller yellow center.
- Add the stem.
- Add the left leaf.
- Add the right leaf.

Use the scrubber bar to scroll through the code and work out where things are going wrong.

### This is a tough exercise

This is a challenging exercise. Take your time. If you get really stuck, ask for help, and remember to give us lots of information about what's not working and why you think that's the case.

Use the scrubber (the play bar at the bottom left) to check the value of your variables if you're not clear on what's happening. Click on the little toggle button to see information on each line.

Remember, the learning is in the struggle. Every time you get something wrong and solve it, you're becoming a coder. Eventually it will feel easy. Just keep going.
