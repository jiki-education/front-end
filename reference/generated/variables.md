# Variables in JavaScript - 10-Minute Lesson Script

**Target Duration**: ~10 minutes
**Audience**: Beginners who have learned about functions
**Format**: Narration with animation cues

---

## Section 1: Opening - Real World Memory (~1 minute)

**NARRATION**: So, let's start by thinking about something that happens in everyday life. Imagine Jiki is at a party, and he meets someone new.

[ANIMATION: Jiki character at a party setting, meeting another person]

**NARRATION**: He asks them their name, and they say, "Hi, I'm Sarah."

[ANIMATION: Speech bubble from person saying "Sarah"]

**NARRATION**: Now, Jiki wants to remember Sarah's name for later. Maybe he'll see her again across the room and want to wave, or maybe he'll want to introduce her to someone else. So what does he do? Well, he gets out a little notepad and he writes it down. "Sarah." There we go.

[ANIMATION: Jiki pulling out a notepad and writing "Sarah" on it]

**NARRATION**: And then, a bit later, Jiki meets someone else. "Hi, I'm Ahmed." Great. He writes that down too. And then another person. And another.

[ANIMATION: Jiki meeting more people, writing down more names: "Ahmed", "Chen", "Maria"]

**NARRATION**: By the end of the party, Jiki's got quite a list of names. And the reason he's done this is simple - he can't remember everything in his head. So he writes things down so that he can look at them later when he needs them.

[ANIMATION: Jiki's notepad showing a list of several names]

**NARRATION**: And this is exactly what variables do in programming. They're a way for our programs to remember information and store it, so that we can use it later.

---

## Section 2: Transition to Inside the Computer (~30 seconds)

**NARRATION**: But what's actually happening inside the computer when we write code to do this? Let's zoom in and have a look at what's going on in Jiki's world when he's running our programs.

[ANIMATION: Visual "zoom in" effect, transitioning from party scene to Jiki's warehouse]

**NARRATION**: We're going to go inside the computer and see how Jiki actually stores and retrieves information when our code is running.

[ANIMATION: Jiki now in his warehouse environment with shelves]

---

## Section 3: The Warehouse Metaphor (~1.5 minutes)

**NARRATION**: So, we've talked before about how Jiki has this warehouse, and in this warehouse, he's got shelves. Lots and lots of shelves.

[ANIMATION: Camera pans across warehouse shelves]

**NARRATION**: Now, you remember from when we learned about functions that some of these shelves contain machines. These machines are the functions that Jiki can use to do different things in our programs.

[ANIMATION: Some shelves showing "machines" with labels like "circle", "rectangle", etc.]

**NARRATION**: But today, we're going to look at a different set of shelves. And on these shelves, Jiki doesn't keep machines. Instead, he keeps boxes.

[ANIMATION: Camera moves to different shelves showing empty boxes]

**NARRATION**: These are variables. They're just boxes. Nice, simple cardboard boxes. And each box has two really important features.

**NARRATION**: First, each box has a label on the front. This label is the name of the variable - it's what we use to tell Jiki which box we're talking about.

[ANIMATION: Close-up of a box with a label reading "name"]

**NARRATION**: And second, inside each box, there's a piece of paper. And on that piece of paper is written a value - maybe a string, maybe a number, whatever we want to store.

[ANIMATION: Box opens to reveal a piece of paper inside with "Sarah" written on it]

**NARRATION**: So, that's what a variable is. It's a labelled box that contains one value. Nice and simple.

**NARRATION**: And just to be really clear, each box can only contain one thing. One piece of paper. One value. That's quite important, and we'll come back to that in a minute.

[ANIMATION: Emphasize: one box = one piece of paper]

---

## Section 4: Creating Variables with `let` (~2 minutes)

**NARRATION**: Okay, so let's have a look at how we actually create one of these boxes in JavaScript. Let's look at a line of code.

[ANIMATION: Code appears on screen: `let name = "Sarah"`]

**NARRATION**: Let name equals Sarah. Take a moment just to look at that. Let name equals Sarah.

**NARRATION**: So, what's Jiki doing when he sees this line of code? Well, let's break it down step by step.

**NARRATION**: The first thing Jiki sees is this word "let". And "let" is a special keyword in JavaScript. It's an instruction to Jiki that means, "I want you to create a new box."

[ANIMATION: Highlight "let" in the code]

**NARRATION**: So, when Jiki sees "let", he knows he needs to make a new box. He gets out his cardboard, and he puts together a nice new box.

[ANIMATION: Jiki assembling a cardboard box]

**NARRATION**: Then, he looks at the next bit - "name" - and he knows that's the label for this box. So he gets out his marker pen, and he writes "name" on the label.

[ANIMATION: Jiki writing "name" on a label and sticking it to the box]

**NARRATION**: And then, he looks at the last bit - the bit after the equals sign - and that's "Sarah". So he gets a piece of paper, he writes the string "Sarah" on it, and he puts that piece of paper inside the box.

[ANIMATION: Jiki writing "Sarah" on paper and placing it in the box]

**NARRATION**: And finally, he puts that box up on the shelf. And there it stays.

[ANIMATION: Box with "name" label goes onto shelf, paper with "Sarah" visible inside]

**NARRATION**: So, before this line of code ran, what did we have? We had empty shelves. No box. Nothing. And after this line of code has run, what do we have? We have a box on the shelf with the label "name", and inside that box is a piece of paper with the string "Sarah" written on it.

[ANIMATION: Split screen showing "Before: empty shelf" and "After: shelf with name box containing "Sarah"]

**NARRATION**: That's all that's happening. And I want you to really try and visualise this. When you see the word "let" in your code, I want you to think, "Okay, we're making a new box." And then you see the name - that's the label. And then you see what comes after the equals - that's what's going inside the box.

**NARRATION**: Just take a second now and really think that through. Visualise Jiki getting that box ready, writing the label, putting the value in.

[ANIMATION: Brief pause, then replay of the box creation sequence]

---

## Section 5: Changing Variable Values (~2.5 minutes) **EMPHASIZE HEAVILY**

**NARRATION**: Right, so we've created a variable. We've got our box with "name" on it, and it's got "Sarah" inside. But what if we want to change what's in that box? What if we want to update it?

**NARRATION**: Well, let's have a look at another line of code.

[ANIMATION: Code appears: `name = "Ahmed"`]

**NARRATION**: name equals Ahmed. And notice something really important here - there's no "let" this time. We're not creating a new box. We already have a box called "name". What we're doing is changing what's inside it.

[ANIMATION: Highlight that there's no "let" keyword]

**NARRATION**: So, let's walk through what Jiki does here, step by step, quite slowly, because this is really important to understand.

**NARRATION**: First, Jiki sees "name", and he thinks, "Right, I need to find the box that's got the label 'name' on it." So he goes to his shelves, and he looks for the box labelled "name".

[ANIMATION: Jiki walking along shelves, looking at labels, finding the "name" box]

**NARRATION**: He finds it. There it is. And he takes it off the shelf.

[ANIMATION: Jiki taking the box off the shelf]

**NARRATION**: Now, he opens up the box, and he looks inside. And inside, there's that piece of paper with "Sarah" written on it - the value we put in there earlier.

[ANIMATION: Box opening, showing paper with "Sarah"]

**NARRATION**: And now, this is the really important bit. Jiki takes that piece of paper out of the box.

[ANIMATION: Jiki removing the paper from the box]

**NARRATION**: And he throws it in the bin.

[ANIMATION: Paper going into a bin, maybe a "whoosh" or disposal effect]

**NARRATION**: It's gone. It's disposed of. We can never get that back. "Sarah" is not in the box anymore. In fact, "Sarah" doesn't exist anymore in this program at all. It's been thrown away.

**NARRATION**: And I really want you to understand this, because this is quite crucial. The box can only hold one thing at a time. So, when we change what's in the box, the old value gets taken out and thrown away. It's gone forever.

[ANIMATION: Emphasize empty box, with bin in background containing discarded "Sarah" paper]

**NARRATION**: So now, the box is empty. But we don't leave boxes empty in JavaScript. So, what does Jiki do next?

**NARRATION**: Well, he looks at the rest of the instruction - equals "Ahmed" - and he knows he needs to put "Ahmed" in the box instead. So, he gets a fresh piece of paper.

[ANIMATION: Jiki getting a new blank piece of paper]

**NARRATION**: He writes "Ahmed" on it.

[ANIMATION: Jiki writing "Ahmed" on the paper]

**NARRATION**: And he puts that piece of paper into the box.

[ANIMATION: Paper with "Ahmed" going into the box]

**NARRATION**: And then the box goes back on the shelf.

[ANIMATION: Box returning to shelf, now containing "Ahmed"]

**NARRATION**: So, let's think about what we had before and after this line of code. Before, we had a box labelled "name" with "Sarah" inside. After, we have a box labelled "name" with "Ahmed" inside. "Sarah" is gone. It's in the bin. It's been disposed of. We can't get it back.

[ANIMATION: Split screen - Before: box with "Sarah" | After: box with "Ahmed", with bin icon showing discarded "Sarah"]

**NARRATION**: And the key thing to remember is: one box, one value. You can't have "Sarah" and "Ahmed" both in the box at the same time. When you change the value, the old one gets thrown away and the new one goes in.

**NARRATION**: Just take a moment to really think that through. Visualise Jiki taking the old value out, throwing it in the bin, writing the new value on a fresh piece of paper, and putting that in.

[ANIMATION: Pause, then replay of the changing sequence]

---

## Section 6: Using Variables in Code (~2 minutes)

**NARRATION**: Right, so we know how to create variables, and we know how to change them. But why are they useful? What do we actually do with them?

**NARRATION**: Well, the whole point of storing a value in a box is so that we can use it later. So let's look at a few examples.

**NARRATION**: Let's say we're drawing something - maybe a sun in a sky. We might create a few variables to store the colours we want to use.

[ANIMATION: Code appears: `let sunColor = "yellow"`]

**NARRATION**: Let sunColor equals yellow. So, we've created a box labelled "sunColor", and inside it is the string "yellow".

[ANIMATION: Box labelled "sunColor" appears on shelf with "yellow" inside]

**NARRATION**: And then maybe we create another one for the sky.

[ANIMATION: Code appears: `let skyColor = "lightblue"`]

**NARRATION**: Let skyColor equals lightblue. Another box, this one labelled "skyColor", with "lightblue" inside.

[ANIMATION: Another box labelled "skyColor" appears on shelf with "lightblue" inside]

**NARRATION**: And maybe we want to store the size of our sun as well.

[ANIMATION: Code appears: `let radius = 50`]

**NARRATION**: Let radius equals 50. And this time, instead of a string, we're storing a number. But it works exactly the same way - it's just a box labelled "radius" with the number 50 inside.

[ANIMATION: Box labelled "radius" appears with "50" inside]

**NARRATION**: So now, how do we actually use these values? Well, anywhere in our code where we want to use one of these values, we just refer to it by its label - by the variable name.

**NARRATION**: So, let's say we're calling a function to set the fill colour. Instead of typing "yellow" directly, we can just say, "Use sunColor."

[ANIMATION: Code appears: `fillColor(sunColor)` or similar]

**NARRATION**: And when Jiki sees "sunColor", he knows to go to the shelves, find the box with the label "sunColor", look inside, and get out the value that's in there - which is "yellow".

[ANIMATION: Jiki going to shelf, finding "sunColor" box, opening it, reading "yellow"]

**NARRATION**: And then he uses that value in the function. So the function gets "yellow", even though we didn't type "yellow" directly. We got it from the box.

[ANIMATION: Value "yellow" being passed to a function]

**NARRATION**: And the nice thing is, we can use that same variable as many times as we want. Every time we refer to "sunColor", Jiki goes and gets the value out of that box.

**NARRATION**: So that's how we use variables. We create them with "let", we store values in them, and then we refer to them by name to get those values back out.

---

## Section 7: Why Variables Matter - Relationships (~1.5 minutes)

**NARRATION**: So, you might be thinking, "Well, why bother with all this? Why not just type the values directly where we need them?"

**NARRATION**: And that's a really good question. Let me show you why variables are so useful.

**NARRATION**: Imagine you're drawing a circle, and you use the number 50 in lots of different places in your code - maybe for the radius, maybe for positioning things, whatever.

[ANIMATION: Code snippet showing hardcoded `50` appearing multiple times]

**NARRATION**: Now, if you want to change that size from 50 to, say, 75, you'd have to go through your code and find every single place where you typed 50, and change them all manually. That's quite painful. And you might miss one. And then your code doesn't work properly.

[ANIMATION: Highlighting multiple `50`s in code, showing the tedium of changing each one]

**NARRATION**: But if instead you'd created a variable - let's say "let radius equals 50" - and then used that variable everywhere, well, now you only have to change it in one place.

[ANIMATION: Code showing `let radius = 50` at top, then `radius` being used multiple times below]

**NARRATION**: You just change that one line - "let radius equals 75" - and boom, everywhere in your code that uses "radius" now automatically gets the new value.

[ANIMATION: Changing `50` to `75` in the variable declaration, showing all uses updating]

**NARRATION**: So, variables let you create relationships between different parts of your code. They make your code intelligent, rather than just static. And they make it much, much easier to change things later.

**NARRATION**: Instead of lots of hard-coded numbers that you have to hunt down and change manually, you've got values stored in labelled boxes that you can update in one place.

---

## Section 8: Closing & Reassurance (~30 seconds)

**NARRATION**: Right, so that's variables. They're boxes with labels that store values. You create them with "let". You can change what's in them by taking the old value out and putting a new value in. And you use them by referring to the label.

**NARRATION**: And I just want to say, this is one of the most fundamental concepts in programming. You're going to use variables every single day of your coding life. I've been coding for 30-plus years, and I still think of them as boxes. I still visualise putting values in and taking values out. So, don't feel like this is a childish mental model - it's actually how I think about it too.

[ANIMATION: Warm, encouraging visual - maybe Jiki giving thumbs up]

**NARRATION**: If any of this feels a bit overwhelming, that's completely normal. Just take your time with it. Go back, re-watch sections if you need to. Really try to visualise Jiki with his boxes and his shelves. Slow down. Think through what's happening before each line of code runs, and what's happening after.

**NARRATION**: And in the exercises coming up, you're going to get lots of practice creating variables, changing them, and using them. And that practice is where it'll all really start to click.

**NARRATION**: So, let's get started.

[ANIMATION: Fade to end card or transition to exercises]

---

**END OF SCRIPT**
**Total estimated duration**: ~10 minutes
