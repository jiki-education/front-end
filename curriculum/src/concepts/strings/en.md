---
title: "Strings"
description: "Pieces of text wrapped in quotes (a letter, a word, a sentence, or a whole paragraph) that Jiki writes on paper."
---

When you want to use a number, you can literally just write that number down, and Jiki knows what you mean. But what about if you want to use a letter or a word or a sentence? For example, with the rectangle function or the circle function, what if you had an extra input where you specified the color? How would we write the color to put it into the machine? If we just write the word green or blue, Jiki will think we're referring to a machine on the shelves, and he'll say, "There is no machine called green. I don't know what to do."

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki standing confused next to the rectangle machine, with question marks above his head"
/>

So we have a rule, which is that whenever we need to use text, we need to put it in quotation marks, in double quotation marks. And when you put something in quotation marks like this, Jiki gets a piece of paper out and writes whatever you put in those quotation marks on that piece of paper, and we call these pieces of paper strings.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki writing the word green on a piece of paper, which becomes a string"
/>

Strings can be single letters, words, sentences, paragraphs, even books. The rule is if it's text, we put it in quotes, and it becomes a string.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="A whiteboard showing strings of different lengths in quotes: a single letter, a word, a sentence, and a multi-line address"
/>

So if we want to have a blue rectangle, we write the number for its left position, its top position, its width, and its height. But for the fifth input, we're going to write blue in quotes.

```javascript
rectangle(10, 20, 30, 40, "blue");
```

Jiki would get the machine off the shelf, put some coins in the first four slots. Then he'll write blue on a piece of paper, and he'll put that paper in the fifth slot and then run the machine.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki feeding the blue paper into the fifth slot of the rectangle machine, with coins 10, 20, 30, 40 in the first four slots"
/>

Strings is one of those technical words that people find a bit intimidating at first, but really it just means text. You'll get used to it very quickly. There's nothing magical about it.

This course has three different objectives. The first is that you learn the technical fundamentals of programming, learning what a string or a function is. The second is that you build a mental model that you can expand on as you learn more complex ideas in the future. That's what Jiki and his factory are giving you. But the third objective is more subtle, but probably the most important, and that is to learn to think like a developer. In the long run, this is gonna determine whether you become an average coder or an expert one. So if you don't care about becoming an expert coder, you can sort of ignore this. But for most of you, that will be your goal, and this is the bit you want to pay the most attention to.

When you're solving exercises, really try hard not to guess at the answers or hack away trying to find the solution. Approach these problems using logic. Everything you need to know to find the solution is given to you in the instructions. The instructions are written carefully to give you the information you need. So take your time reading the instructions and take your time thinking about things before you start coding. If you find yourself guessing at things, just slow down a bit, read the instructions, get a pen and paper out maybe and draw things out, and then try again at the coding side.
