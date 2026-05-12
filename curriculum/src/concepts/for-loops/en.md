---
title: "For Loops"
description: "A loop with three parts — an initializer, a condition, and an increment — giving full control over iteration."
---

You might remember that the repeat loop doesn't really exist in JavaScript. It's just something added to make your life a little bit easier while we get going.

So what do we use instead? Well, we use a normal `for` loop, and that looks like this.

You can see why that might have been a bit intimidating on day one for you.

But now you have all of the knowledge you need to get comfortable with this. So let's break it down.

A for loop has three components, an initializer, a condition, and an increment.

The initializer, this `let i = 0` bit, that runs at the start of the whole loop. It just runs once, and here it creates a box called `i` set to zero.

The next bit before the condition runs each time before each loop iteration.

If the condition is true, we run the loop again.

If it's not, we don't.

And then finally is the increment, the `i++`.

`i++` just means the same as `i = i + 1`. It's just a shorthand, a way of increasing i by one each time.

So in this example, we'll set i to zero. We check whether i is less than two, which it is, and so we run the loop.

And then at the end, we increase i by one, so i becomes one. Zero plus one is one.

And then we go again. We check whether one is less than two.

It is, so we run the loop. And then at the end, we increase i again. So now it's two, one plus one equals two.

And then we go a third time. This time we check whether two is less than two, and it's not, so we don't run the loop, and we're finished with the loop, in fact. We just move on to any code below. So we ran the loop twice, and that's a useful thing to know. As long as we start at zero and have a condition `i < n`, the number n is the amount of times the loop will run.

So this is the same as saying repeat two.

So it's not hard, but it's much more convoluted than just writing repeat two.

The next loop to know about is a `while` loop.

This says, "While some condition, run the loop." So we might have a rule that says you can only shoot five times in Space Invaders. So we'd have a loop here that says, while the number of shots is less than five, run a loop that allows someone to play the game.

Each time someone shoots, we increase the numShots by one, and eventually we'll hit five and the loop will exit.

One problem with while loops is that it's quite easy to have bugs that mean the loop never ends. And these are called infinite loops, and they're one of the most common bugs in programs.

When your computer slows down, the fans start spinning, everything gets loud, that's often because someone's left an infinite loop that never ends in their code.
