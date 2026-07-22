---
title: "The `not` operator"
description: "Using `!` to flip a boolean: true becomes false and false becomes true, useful for toggling or inverting checks."
---

So far, when we've compared things to see if they're equal, we've used three equal signs. Sometimes, though, we want to check whether things are not equal, and for this, we use an exclamation mark followed by two equal signs. And generally, in programming, an exclamation mark or <define>bang</define>, as I think our American friends call it, means not. So imagine you work in a shop, and management have made a decision that no disco outfits are allowed in.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/shop-bouncer.webp"
  alt="A bouncer on the door of a shop checking the outfits of a queue of people"
  width="451"
  height="400"
/>

We can say, "If the outfit is not disco, open the door." The if statement works exactly the same.

```javascript
if (outfit !== "disco") {
  openDoor()
}
```

It's just that the condition returns true if the things are different, and it returns false if they're the same. So we could write the same thing out by saying, "If the outfit is disco, do nothing. Else, open the door." But generally, it's easier and cleaner to use the `not` <define>operator</define> to really know and say what you mean.

One more thing related to this. Sometimes you're gonna have a variable that's true, and you want to flip it to false, or you're gonna have something that's false, and you want to flip it to be true, and we can use this to keep track of something. So imagine we have something bouncing from left to right, and we have a variable called <define>`movingRight`</define>, which is true when you're supposed to move right. But when you want to <define>toggle</define> it to be false, when you hit the right edge.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/pong-court.webp"
  alt="A Pong-style court with paddles and a ball bouncing from side to side, illustrating toggling a movingRight variable"
  width="500"
  height="352"
/>

So we could do this by saying, "If `movingRight` equals true, `movingRight` equals false. Else, `movingRight` equals true." That's a way of toggling the variable. So Jiki will look at `movingRight` to see whether it's true or false, and then will work out the opposite and put that value back in the box.

But there's a neater way to do this, and that's to use the same exclamation mark or bang. We can say `movingRight = !movingRight`, and that flips it. `!movingRight` means the opposite of whatever it is.

```javascript
movingRight = !movingRight
```

So if `movingRight` was true, now it's false. If it was false, now it's true. Jiki gets what's in the box currently,

and that bang tells him to find the opposite. So the opposite of true is false. The opposite of false is true, and then he puts it back in the box. This is exactly the same as that longer if/else statement, but it's just much neater and more succinct to write.
