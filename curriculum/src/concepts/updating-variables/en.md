---
title: "Updating Variables"
description: "Changing what's inside a variable as your program runs so you can track positions, counts, scores, and other shifting values."
---

So far, when we've created variables, we've put values in boxes and then got them out later. That's been really useful for adding clarity to our code and for reducing some of the mental arithmetic we might have otherwise had to do. But the real value from variables comes from the ability to change what's in a box, what's in the variable, throughout a program. So even though we might run the same bit of code multiple times, what it does might change based on what's inside the boxes.

Say we want to plant a flower in a garden. We have a handy plant function that has a single input for the position we want to place the flower. So if we want to place a flower 10 from the edge, we write plant(10). Nice and simple.

```javascript
plant(10)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/flowers-same-spot.webp"
  alt="A flower planted in a garden next to Jiki's whiteboard"
/>

What about if we want to plant eight flowers? Well, we could write plant(10), plant(20), plant(30), etc, but that's pretty tedious.

And we've already learnt about something that helps us replace this sort of tedious code. Use a loop! Use a repeat block! So let's set the position to be 10, and then have a repeat block where we call plant, we use the plant function, eight times.

```javascript
let position = 10
repeat(8) {
  plant(position)
}
```

What do you think will happen?

Well, it's gonna plant eight flowers, but it's gonna plant them in the same spot each time, which isn't really what we want. So let's just take a moment to think about what Jiki is doing here. He's making a box with the position label. He's putting 10 in it. Then he's running the plant machine 10 times. Each time, he's getting out the value from the position box. It's always 10, and he's putting that same 10 in each time.

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-loop-walkthrough.webp"
  alt="Jiki taking the position box off the shelf and feeding its value of 10 into the plant machine"
/>

So what we need is a way to move along a little bit each time. After we've planted a flower, we want to tell Jiki to move the position along 10, ready to plant the next flower.

So forgetting code for a second, what does it look like logically to do that? If I say to you, "Plant the first flower at 10, then the next at 20, then the next at 30," how does your brain know that the next one should be planted at 40 and the one after that should be planted at 50?

What your brain is doing is keeping track of the current number and adding 10 to it, and then updating that number in your brain.

And we can do exactly the same thing in code. To do this, we say, "Update the position box to have the current position value plus 10."

When Jiki sees this, he'll get the current number out of the position box, add 10 to it, do that maths, adding them together, and then put the result back in the box for next time.

```javascript
position = position + 10
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-updating-box.webp"
  alt="Jiki taking 10 out of the position box, adding 10 to make 20, and putting 20 back in the box"
/>

So if we add this to our program, so that we now say, "Set the initial value of the position to be 10," then eight times plant a flower at the position, and then change the position to be 10 larger than before, our code works, and we get eight flowers spaced out.

Notice that there's no `let` when we update the variable. That's really important. When Jiki sees let, he creates a new box. But here, we don't want to create a new box. We want to change what's in the box that we've already got.

Also note that we only create the box once outside of the loop. That's important to remember. Create the box once at the top, and then update it each time the loop runs.

We can update what's in boxes, and we can use that power to track something that changes over time. You're gonna be using this pattern constantly, tracking a position, counting how many times something's happened, keeping score. Whenever you need to remember something that changes as your program's running, this is how you do it.
