---
title: "Else If"
description: "Chaining `else if` clauses to check several conditions in order, running only the first block whose condition is true."
---

You've seen how `if` and `else` give you two paths: do one thing when a condition is true, do another when it's false. But what if you've got more than two possibilities?

Imagine our bouncer is selling tickets. Under thirteen, you get a child's ticket. Between thirteen and twenty, you get a teen ticket. Twenty or over, it's an adult ticket. So you've got three different outcomes now. For this, we can add another if statement after the else. So we can say, "If this, then do this. Else if this, do that. Else, do this other thing." So in this example, Jiki will see the if and check the first condition. Is sixteen less than thirteen? No. So he moves on to the else if. Is sixteen less than twenty? Yes, that's true. So he runs that block and gives out a teen ticket. But then he's done. He doesn't check anything else. He doesn't look at that final else at all. Once Jiki finds a condition that's true, he runs that block, and he skips everything else below it.

```javascript
if (age < 13) {
  childTicket();
} else if (age < 20) {
  teenTicket();
} else {
  adultTicket();
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else-if/tickets.webp"
  alt="Three tickets labelled CHILD, TEEN, and ADULT, one for each outcome of the age check"
/>

This is the key thing to understand. Only one block ever runs. Jiki works down this chain, finds the first true condition, runs that block, and moves on.

Now, there's one thing to really understand because this trips people up. There's a subtle but very important difference between writing two separate if statements and using else if. So imagine we're creating a program that gives either a basic prize or a bonus prize depending on someone's score. Look at these two possibilities. One uses else if and the other uses two ifs. What will happen differently?

So in the first case, with the else if, we check for high score and give the bonus prize, and then we don't run the else. So the person, if they've got a score over a hundred, just gets the bonus prize.

But in the second example, the two ifs are totally independent. Both will run and both will be true. So the person here gets two prizes. In the first one, one prize. In the second one, two prizes. Take a moment just to make sure you really understand that.

Also, it's interesting to note that either might be correct depending on the way the game is designed. Maybe the contestant gets a normal prize and a bonus one, or maybe they're just upgraded to the bonus prize. Neither piece of code is right or wrong. They're just useful in different situations. But you need to know which one you're intending to use.
