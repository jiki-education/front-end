---
title: "Animation"
description: "Making things move on screen by updating positions over time."
---

So far, when we've used repeat loop to draw things, each new thing we've drawn has added something to the image. If we've drawn a new brick in a wall, it's filled a gap. If we've drawn 10 circles, we see 10 circles on the screen. It's like a painting. Once you put paint on the wall, it doesn't disappear when you paint something new next to it. It stays there. But what if we want to make something look like it's moving?

Have you ever seen a flip book? They were really popular when I was a kid, less so now. A flip book's a little book where each page has a slightly different drawing. As you flip through the pages quickly, your eyes see the drawings change, and your brain thinks something's moving. It's not actually moving. It's just lots of slightly different pictures, one after another. And that's exactly how animation works in code. The trick is the same. Before we draw a new scene, we paint over the whole canvas with a background color, a bit like starting a fresh page in our flip book, and then we make a small change to the scene to look like movement.

So if we take a familiar block of code where we draw circles across the screen, we set a position variable, and we have a repeat block where we draw a circle and then move the position one to the right. If we run that repeat block 100 times, we're going to see 100 circles across the screen.

Now, look what happens if we just add one plain rectangle before we draw the circle each time.

Instead of a trail of circles, our eyes are now tricked into seeing one circle that appears to glide across the screen.

Every time we go through the loop, we're painting a whole new background, covering up everything that was there before, and then drawing the circle in its new spot.

Each time through the loop is like a new page in the flip book.

And the key thing to understand here is that we're not moving the circle. The circle isn't an object that slides across. It's just a drawing. Each time through the loop, we paint over the old drawing, and we make a brand-new one slightly to the right. Your eye puts it all together and sees movement, but really, it's just lots of separate drawings, one after another.

You can use this idea to create a sunset. You make the sun move, change its size, change its color. It's all the same technique. Set some variables, paint a fresh background, and draw everything. Update the variables, and then repeat.
