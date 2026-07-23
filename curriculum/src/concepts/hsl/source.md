---
title: "HSL Colors"
description: "Building colors from hue (the shade, 0–360), saturation (how vivid, 0–100), and lightness (how bright, 0–100)."
---

<literal>HSL</literal> gives us a completely different way to think about colors than <literal>RGB</literal>. HSL stands for <define en="hue (H)">hue</define>, <define en="saturation (S)">saturation</define>, and <define en="lightness (L)">lightness</define>. You have a function called `hsl` that takes three numbers, one for hue, one for saturation, and one for lightness, and it will return out a color. So let's break down what those three words mean.

```javascript
hsl(hue, saturation, lightness)
```

Hue is the shade of color that you want, and it goes from zero up to 360. Maybe imagine a rainbow. This is how I think about it. On the left, we have red, and then we have orange, yellow, green, blue, purple, and actually, we go all the way back to red. So if you say zero, you start on the left, and that is red. If you say `120`, you're asking for green. `230` is blue. You can also think of this as a color wheel, which is what the 360 really is. It's the number of degrees in the circle. I always just look up the numbers I want, so don't worry too much about trying to memorize this, but it is nice to know what's going on. So that's hue, which is the shade. Next, we have saturation, which is how vivid the color is. It goes from zero to 100. At zero, you just get gray. There is no color, no tone in there at all. At 100, you get full, vivid, vibrant color. And then we have lightness. Lightness is how bright the color is, and that goes from zero to 100 as well. At zero, you get black. No matter what hue you've chosen, you get black. There's no light in it. And at 100, you get white. No matter anything else, it's just full of light, so it's white. 50 is right in the middle, the normal color. So you can think of this as a slider for making the color brighter or darker.

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/hsl-hue-wheel.webp"
  alt="A hue color wheel and rainbow showing 0 is red, 120 is green, and 240 is blue"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/saturation-slider.webp"
  alt="A saturation slider from 0 (gray) through 50 to 100 (full vivid color)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/lightness-slider.webp"
  alt="A lightness slider from 0 (black) through 50 to 100 (white)"
  width="500"
  height="398"
/>

So if we want a normal red circle, which we'd have written as 255, zero, zero with RGB, all of the red, no green, no blue, here we would use zero, 100, 50. Zero for the red hue, 100 for saturation, full color, and 50 for brightness, which is a normal level of brightness. If we wanna make that a green circle, we can just change that hue to be `120`. If we want to make it a darker green, we can reduce the lightness down to `25`.

```javascript
hsl(0, 100, 50)
hsl(120, 100, 50)
hsl(120, 100, 25)
```

If we want to make it a duller green, we can take some of the color, some of the saturation out, say take that down to `30`.

If you want a bright, hot pink, a hue of about 300 is pink, and then we up the saturation to 100 to make it really vivid, and we boost the lightness, too, to about 60.

HSL is great when you want to cycle through colors. If you want a rainbow, you can just keep increasing the hue.
