## Section 1: Opening - Real World Memory

[TALKING HEAD]

In this lesson, we're starting to look at the idea of memory. 

A computer's memory is just like our memory! If we want to be able to retrieve some piece of information later, we need to be able to remember it in the first place.

[ANIMATION: Jiki in a coffee shop. Asks name. "Hi, what's your name". "I'm Sarah". "Hi Sarah" ... 5 days later ... Sarah says "Oh, hi again Jiki"..., Jiki says "Oh hi ....", Close up on Jiki sweating with a question mark in a thought bubble. Jiki's face goes red.]

Imagine you're at a coffee shop, and someone tells you their name.
It sort of magically floats into our brain and stays there....
Or maybe it doesn't - maybe we really wanted to remember that name, but we forgot it...

[ANIMATION: Jiki in a coffee shop. Asks name. "Hi, what's your name". "I'm Sarah". Jiki writes down Sarah and puts it in his pocket then says "Hi Sarah" ... 5 days later ... Sarah says "Oh, hi again Jiki"..., Jiki says "Oh hi ....", Close up on Jiki getting the paper out, checking it, and then looking relieved, then saying "... Sarah!"]

When we're coding, we don't have this problem. In computer land, when someone tells us their name, we always write it down, and keep it for later. When we need it again, we find the piece of paper we wrote it on, and get the answer for definite.

Rather than relying on the magic of our brains, we actively tell the computer to keep a record of everything.

It's a little less magical than our brains, but a lot more reliable!

## Section 2: Introduction

[TALKING HEAD]

Memory is one of the most important concepts in programming. In the old days we had to do a lot of very manual work to save things for later, but now-a-days it's pretty straightforward. You just need to understand a few concepts, and you'll be set!

[SLIDE to the RHS with three bullet points appearing].
We need to know three things:
1. How to remember things
2. How to retrieve things we know
3. How to change the things we know

## Section 3: Saving/retrieving warehouse

[ANIMATION: Jiki writing something down and putting it in a box]

Let's start off by seeing what Jiki does to remember something.

Let's say we've told Jiki: [Remember the name "Sarah"] (put this as like an instruction top right)

Jiki firstly writes down the name "Sarah".
Then he gets a box and puts a label on the box for "name".
Then he pops the piece of paper with "Sarah" into the box.
And puts the box back on the shelves with any other things he's been asked to remember.

Later on, if we say [What was name we asked you to remember?]  (put this as like an instruction top right)
he'll go and get the box that has the "name" label off the shelf.
Take a look inside.
Find "Sarah" 
And tell us the answer.

## Section 4: JavaScript and the warehouse again.

So we need to learn how to tell Jiki to "Remember the name "Sarah"" and how we can ask "What was name we asked you to remember?"

[CODE BLOCK]
```javascript
// Remember something
let name = "Sarah"
```

Telling Jiki to remember something is easy. We use the `let` keyword with the name of the box, and the thing we want to put in it. 
- `let` just means "create a box".
- the next word is the label we want to put on the box - in this case "name";
- and then we use the equals sign followed by whatever we want to store inside the box - in this case the word "Sarah".

[CODE BLOCK]
```javascript
// Remember something
let name = "Sarah"

// Use a greet function to say hello to 
// someone using their name.
greet(name)
```

When we want to retrieve the value from our memory, we simply refer back to the label that we put on the box. In this example we're using the `greet` function to greet someone with their name.

It's very important here to understand that "name" here isn't anything magical. You could call it `cute_red_cat` and it would still work. All it is a label that you write on the box. Because you're the coder, you can give it whatever label you want! But it's probably best to stick to sensible names like "name".

[CODE BLOCK]
```javascript
// Remember something
let cute_red_cat = "Sarah"

// Use a greet function to say hello to 
// someone using their name.
greet(cute_red_cat)
```

## Section 5: Variable Clarity

[ANIMATION]

Let's just do one walk through, and I want you to think about what's going to happen at each step. I really want you to focus on visualising what's happening. Right now, there's not a lot going on, but once we get deeper this will get much more complex and having this ability to visualise what's happening will MASSIVELY help you.

So we've got our two lines of code on the right hand side. And Jiki is going to work through them.

[CODE BLOCK]
```javascript
let name = "Sarah"
greet(name)
```

Take a moment to imagine what Jiki will do when he processes that first line of code.

[Pause for a couple of seconds]

Then firstly he gets a piece of paper and writes "Sarah" on it
Then he gets an empty box and writes "name" on the label.
Then he puts the piece of paper in the box.
And finally he puts the box on the shelf.

Now what will happen when he processes the second line of code? 

[Pause for a couple of seconds]

It's going to involve both a box and a machine. Think about how they'll work together...

[Pause for a couple of seconds]

OK, so he'll go to the shelves and tries to find a box with the label of "name".
He finds it, opens it up, and takes out the piece of paper, which has "Sarah" written on it.
Then he heads over to the `greet` machine, puts the piece of paper into the input of the machine, and runs the machine.
[Machine should have a speech bubble that says "Hello, Sarah!"]

## Section 6: Conclsuion

Did you get it right? Nearly everyone misses a little step when they're thinking about this at first, but with practice your visualisaton will get really good and everything will be a lot easier in the long run.

Remember, when you see the word "let" in your code, I want you to think, "Okay, we're making a new box.". Really get that clear in your mind.

We're going to give you a couple of quick exercises now where you can create and use variables. Then we'll come back and look at how we update variables and move onto some more interesting exercises!
