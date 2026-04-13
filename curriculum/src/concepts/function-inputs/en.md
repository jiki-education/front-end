---
title: "Function Inputs"
description: "Passing extra information to functions to control their behavior."
---

## Introduction

One of the more powerful things about functions is that many of them let you put some information into them when you use them, which changes how they run.

You see the little slot on this `walk` machine? That’s a slot that Jiki can use to specify how many steps your character should walk forward, so rather than having to use the move function three times in a row, instead you can now just use the walk function and tell Jiki to put the number three into the machine.

To do this in code, we still write the name of the function, in this case `walk`, and we still put our opening bracket. Then, before our closing bracket, we say what we want the input to be, so in this case we want the input to be `3` to say `walk three steps forward`. When Jiki sees that, he’ll get a number 3 - which you can think of as a little coin - and he’ll put that into the input slot of the machine before he pulls the crank to turn it on.

## Multiple Inputs

When we want to input multiple things into machines, we seperate them with commas in between. The name of the function, a bracket, each of the different inputs seperated separated by commas, and then we close our brackets.

For example, to draw a rectangle, we write:

```
rectangle(10, 20, 30, 40)
```

That's one function with four inputs.

## You have to input what a machine expects.

If you try and use a function with the wrong number of inputs, you’re going to get an error. For example, if you try and put 1 input in a machine that doesn’t have a slot, Jiki will tell you that you can’t. And if you try and use a machine that has an input slot, but you don’t tell Jiki what to put in it, he’ll stop and complain. Try it if you’re feeling a bit rebellious and see what happens!
