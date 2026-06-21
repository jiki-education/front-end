---
title: "Else"
description: "Adding an `else` clause after an `if` so a different block of code runs when the condition turns out to be false."
---

If statements let you check conditions and run code only when something is true. Now let's introduce if's partner in crime, `else`.

With an if statement, Jiki runs the code block when the condition is true, and he skips that code block when it's false. But what about if you want Jiki to do one thing when the condition is true and a different thing when it's false? That's what else is for. We can put an else clause after the closing brace of if, and Jiki will run that if the if's condition is false. So going back to the club bouncer example, we now have the option to open the door or to turn someone away, which is probably better than absolutely ignoring them like we were before. Think of it like a fork in the road. Jiki reaches this fork, he checks the condition, and then he can go one way if it's true, or he can go the other way if it's false. But he never goes both ways.

```javascript
if (age >= 21) {
  openDoor();
} else {
  turnAway();
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else/fork-in-the-road.webp"
  alt="A fork in the road at the club door: open the door when the condition is true, turn the person away when it is false"
/>

But what if you've got more than two possibilities? Imagine our bouncer is selling tickets. Under thirteen, you get a child's ticket. Between thirteen and twenty, you get a teen ticket. Twenty or over, it's an adult ticket. So you've got three different outcomes now. For this, we can add another if statement after the else. So we can say, "If this, then do this. Else if this, do that. Else, do this other thing." So in this example, Jiki will see the if and check the first condition. Is sixteen less than thirteen? No. So he moves on to the else if. Is sixteen less than twenty? Yes, that's true. So he runs that block and gives out a teen ticket. But then he's done. He doesn't check anything else. He doesn't look at that final else at all. Once Jiki finds a condition that's true, he runs that block, and he skips everything else below it.

This is the key thing to understand. Only one block ever runs. Jiki works down this chain, finds the first true condition, runs that block, and moves on.

Now, there's one thing to really understand because this trips people up. There's a subtle but very important difference between writing two separate if statements and using else if. So imagine we're creating a program that gives either a basic prize or a bonus prize depending on someone's score. Look at these two possibilities. One uses else if and the other uses two elses. What will happen differently?

So in the first case, with the else if, we check for high score and give the prize, and then we don't run the else. So the person, if they've got a score over a hundred, just gets the bonus prize.

But in the second example, the two ifs are totally independent. Both will run and both will be true. So the person here gets two prizes. In the first one, one prize. In the second one, two prizes. Take a moment just to make sure you really understand that.

Also, it's interesting to note that either might be correct depending on the way the game is designed. Maybe the contestant gets a normal prize and a bonus one, or maybe they're just upgraded to the bonus prize. Neither piece of code is right or wrong. They're just useful in different situations. But you need to know which one you're intending to use.
