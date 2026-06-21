---
title: "Functions That Return Things"
description: "Catching a value that pops out of a function's output chute and using it in your code."
---

So far we've looked at functions that do something in the world. So the circle function draws a circle. The move function moves your character. But some functions work differently. Rather than doing something external, they give you something back that you can use within your code. When a function gives something back to Jiki to use in the code, we say that this function is returning something. It returns something back out to Jiki. You can think of these machines as having an output chute. We already have our input slots that we put things into, but we can also have a single output slot or a chute that something can come back out of. When Jiki presses the button on the machine, the machine whirs away, and something will pop out of that chute at the end. It could be a number. It could be a string. It's something that Jiki can catch and can use.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/machine-with-return-chute.webp"
  alt="A machine with an output chute on its side, ready to send a value back out to Jiki"
  width="500"
  height="317"
/>

Most functions, probably 95% of them, return something. They might do some maths for you and return the value, or they might glue some strings together and then give you the resulting string. Or maybe they give you back the current time every time you run that machine. Let's look at this last one. Let's say that we have a function called get current time. Every time Jiki runs the machine, a piece of paper slides out the output chute with the time written on it, maybe 14:35.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/paper-out-of-chute.webp"
  alt="The getCurrentTime machine with a piece of paper reading 14:35 sliding out of its output chute"
  width="500"
  height="312"
/>

And then we can put that returned value into a box using let. If we say let time equals get current time, Jiki will run the machine, get the current time from the chute, and store it in a box called time.

```javascript
let time = getCurrentTime()
```

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/jiki-boxing-time.webp"
  alt="Jiki placing the 14:35 paper from the chute into a box labelled time"
  width="372"
  height="400"
/>

Now, it's important to understand that the piece of paper that Jiki puts in the box is fixed at that moment. Even if the actual time changes while your program is running, the box still has that piece of paper with 14:35 written on it. Once something is in the box, it's a fixed thing in there. It doesn't magically change. If we want to put the current time in the box again in future, we need to use our get current time function again to get it.

Most functions that return things also have inputs. For example, we might have a join function that takes two strings as its inputs and returns them joined together with a space. So if we use a join machine with hello and world as our inputs, out the chute will come a single string with hello world written on it.

```javascript
join("Hello", "World"); // "Hello World"
```
