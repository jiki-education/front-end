---
title: "Break"
description: "Using the `break` keyword inside a loop body to exit the loop immediately and move on to code that comes after it."
---

The `break` keyword can be used anywhere in the body of any loop.

The bit between the curly braces, that's the body. And when Jiki sees it, he'll exit out of the loop immediately and move on to whatever code is below the loop.

So if we have a constraint that says run this loop 50 times, but we wanna stop if the user shoots five times, we could have a for loop at the top that counts up towards 50.

But then we could have a condition in the middle of the loop that checks whether the user has shot five times, and if they have, we <define>break</define> to stop the loop.

```javascript
for (let i = 0; i < 50; i++) {
  if (numShots >= 5) {
    break; // exit the loop
  }
}
```
