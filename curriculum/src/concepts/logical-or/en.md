---
title: "The `or` keyword"
description: "Combining two conditions with `||` so the whole condition is true when at least one of the parts is true."
---

We can also use `or`, and again, sadly, there's not a nice or keyword in JavaScript. Instead, we have to use these two bars next to each other to mean or. It looks weird, but it's really not. You'll get used to it.

So we can say if someone is over 20 or they're in disco gear, then they can come in. So we're gonna have a fun party with disco-dressed kids and badly dressed adults, which sounds reasonable.

```javascript
if (age > 20 || outfit === "disco") {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-or/party-door.webp"
  alt="Jiki welcoming a mix of disco-dressed kids and casually dressed adults through the door to a party"
  width="327"
  height="400"
/>

There's one thing that trips people up with both and and or, and that's that each side of the and/or needs to be a complete comparison. So even if you're comparing the same variable on both sides, you have to repeat it. You can't write `if age is less than 13 or greater than 20`. You have to write `if age is less than 13 or age is greater than 20`. You need both sides to be complete comparisons.

You need to think about when both conditions matter and when only one of them needs to be true.
