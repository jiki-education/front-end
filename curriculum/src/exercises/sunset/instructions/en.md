---
title: "Sunset"
description: ""
---

Your task is to animate a sunset scene that lasts 100 iterations. It should look like this (the flickering is exactly what you see with flipbooks too!):

<img src="/static/images/exercise-assets/sunset/example.gif" alt="Sunset" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 16px;" />

We've drawn the initial scene for you. You need to animate a few things, using the flip-book style you learned in the last video:

- **The size of the sun**: It should start with a radius of 5 and grow by 0.2 each iteration.
- **The position of the sun**: It has an initial center of (50, 10), and should lower in the sky by 1 each iteration.
- **The color of the sun**: Animate from yellow to orange using RGB. You can choose whatever values you like, but we recommending start with `255, 237, 0` and reducing the green for a nice effect.
- **The color of the sky**: Use HSL to animate the sky color. You'll want to increase the hue throughout the animation. Choose values that you think look nice. We've gone for a pink sunset in the animation above, but you can choose all sorts of different vibes!

Remember: to animate in flip-book style, we are simply drawing the whole scene again over the top of the previous version.

Good luck!
