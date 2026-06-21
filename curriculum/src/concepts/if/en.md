---
title: "If Statements"
description: "Using the `if` keyword to run a block of code only when some condition is true, like a bouncer letting people through."
---

There's a keyword that helps us tell Jiki to only do things in certain situations. Maybe you're writing some code to guard the entrance of a bar, maybe you're a bouncer, and Jiki should only open the door if someone's appropriately dressed. Or maybe you're writing some code where you're in charge of waving the checkered flag at the end of a race, but Jiki needs to know that he should only do it on the last lap. In these sorts of situations, we're going to use the `if` keyword.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki as a bouncer deciding whether to let people into the night club"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki ready to wave the checkered flag at the end of a race"
/>

We use the if keyword in a very similar manner to the repeat one. We put some information in normal brackets. In this case, that information is the condition that we're checking. And then we put a block of code in the curly braces that we run only if that condition is true.

```javascript
if (condition) {
}
```

So what do these conditions look like? Well, normally, they're some sort of comparison. We compare two numbers or strings and check whether the result is true or false.

So think of these as statements that you could say out loud. Three is less than five. That's true. Seven is less than two. That's false.

We use symbols to write these comparisons. You'll already likely be familiar with them from maths. We have less than, greater than, less than or equal to, greater than or equal to, and we also have a check to see whether two things are the same, whether they're equal. And this one's a bit different from what you're likely used to because we use three equal signs in a row to see if two things are the same or different.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="A table of comparison operators: less than, greater than, less than or equal, greater than or equal, equal, and not equal, with examples"
/>

And this helps us not get confused with when we're setting or updating variables, and we use an equal sign to mean put this in the box. Just remember three equal signs for comparing.

You can compare strings too. So hello equals hello. That's true. The two strings are the same. But be careful here, because Jiki compares every single character in both strings on both pieces of paper. So hello with a capital H is not equal to hello with a small H. They're different strings. So comparing those would be false, because the capital H and the lowercase H are different characters.

Also, by the way, true and false, they're called Booleans, and that's another technical-sounding word. But it's really simple. It's just a formal way of saying that something is either true or false. So if you hear me say Booleans or someone else say Booleans, it just means true or false. Let's see this in action. Imagine we're building that robot bouncer for a club, and we're gonna say the bouncer should only open the door if the person is 21 or older. So we have an `askAge` function, which we can use to get someone's age, and we're gonna save the result of that in a variable called age. And then we can say, if that age is greater than 20, we'll open the door. So if `askAge` returns 30, we open it, and if it returns 12, we don't.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki opening the door for someone old enough, and refusing entry to someone too young"
/>
