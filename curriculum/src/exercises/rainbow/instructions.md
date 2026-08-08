---
title: "Rainbow"
description: "Paint a rainbow from 100 colourful vertical bars."
---

Your task is to make a beautiful rainbow pattern made up of 100 vertical bars. It should look like this:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Rainbow" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

The rainbow is made up of `100` bars, each going from top to bottom with a width of `1`. The first bar should have an <define>`x`</define> of `0`, and the final bar should have an `x` of `99`.

To set the color, use the <define>`hsl(...)`</define> function. This <define>returns</define> a color string that you can then use as the final input in <define>`rectangle(...)`</define>. Setting the <define>saturation</define> and <define>lightness</define> values to around `50` is probably best. The first bar should have a **<define>hue</define>** of `0`. The hue should increase for each bar and end up somewhere near 300.
