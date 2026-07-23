---
title: "Repeat Without Count"
description: "Leaving the brackets of a repeat loop empty so Jiki keeps going until something else tells him to stop."
---

So far, when you've used the repeat loop, you've always specified a number that says how many times to repeat. Repeat five times, 10 times, 40 times. You've used a variable to do this too sometimes. But you've always told Jiki exactly how many times to repeat the loop. However, sometimes we don't know in advance how many times to repeat. Think about the maze. Way back at the start of this course, you solved the maze by writing out specific moves. You could see the maze, count the steps, and write the right number of moves.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-known-path.webp"
  alt="A maze where the character can see the path, count the steps, and write out exactly the right moves"
  width="418"
  height="400"
/>

```javascript
move()
move()
turnLeft()
move()
move()
```

But what if I said, "Write me some code that can solve any maze I give you?" That maze might need 10 steps, or 50, or 200. You have no idea in advance.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-example.webp"
  alt="Several different mazes of varying shapes and sizes, with Jiki puzzling over how to solve any of them"
  width="402"
  height="400"
/>

So you need a way of just telling Jiki to just keep going. Keep checking which way you can go, keep making decisions, keep moving forward, over and over until you're done.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill.webp"
  alt="Jiki running on a treadmill, just keeping going over and over"
  width="428"
  height="400"
/>

And the way to do that is really simple. Just don't give the `repeat` keyword a number. Just leave those brackets empty. If you do this, Jiki will just keep on going until something else tells him to stop. Later on, we'll look at what those something elses are. But for now, he'll just keep going until the exercise is finished, or until he decides he's been going for absolutely ages, wants a break, and decides he's had enough.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill-exhausted.webp"
  alt="Jiki slumped exhausted over the treadmill after going for ages, ready to give up and take a break"
  width="500"
  height="378"
/>
