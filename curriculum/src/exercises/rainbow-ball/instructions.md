---
title: "Rainbow Ball"
description: "Build a bouncing ball that paints a rainbow trail across the canvas."
---

Your job is to create a ball that randomly bounces around the canvas, drawing a rainbow in its wake.

It should look something like this:

<img src="/static/images/exercise-assets/rainbow-ball/example.gif" alt="Animated rainbow ball bouncing around the canvas leaving a coloured trail" style="width: 100%; max-width: 200px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

As part of this exercise, you have the <define>`Math.randomInt(min, max)`</define> function which returns a random integer between the `min` and `max` you give it.

Take a few minutes to think through how you could solve this. This is the most valuable part of the exercise, so take your time and **write down your ideas before you read the formula below.**

When you've got an idea of your approach, read on. But don't read on until you've spent some time thinking!

## The Formula

This project is all about having some variables that are responsible for the position of the ball, which steadily increase or decrease. And other variables that control **how** the ball is moving and change when certain criteria are met.

### Drawing

- The first circle you draw should be at `(5, 5)`.
- All the circles should have a radius of `10`.
- The colour of the circle should use HSL, starting with a hue of `100` (green), a saturation of `80` (bold colours), and a lightness of `50` (mid-brightness).

### Animating

- To start with, in each iteration you should move the ball `2` to the right and `1` down.
- The hue should increase by `1` each time, until it gets to the maximum (`360`), then start reducing again. The saturation and lightness don't need to change.

### Bouncing

- Once the ball reaches the edge of the canvas it should change direction. (Check the hints if you can't work out how to do this.)
- To make things more fun you should change direction using the `Math.randomInt(min, max)` function. Choose <define>`min`</define> and <define>`max`</define> that give the style of animation you want.

## To pass the checks

We've given you a lot of leeway in this exercise. We check that:

- The first few circles are correct.
- Over 80% of the canvas gets painted.

The numbers that you choose to achieve that are up to you. You probably want a repeat block that iterates between `500` and `1000` times.

## Break it down...

The key to this exercise is to do things one at a time:

1. Make the ball change colour as it moves
2. Make it bounce off the right hand side
3. Make it bounce off the bottom.
4. Make it bounce randomly
