---
title: "Relational Traffic Lights"
description: "Rebuild your traffic light so everything scales together."
---

You're back with the traffic lights! This time, everything should be relative to the `radius` variable so the whole traffic light scales when you change it.

<img src="/static/images/exercise-assets/relational-traffic-lights/target.png" alt="Target traffic light" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### How it works

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- The color variables and `radius` are fixed for you.
- You need to derive all position and size variables as multiples of `radius`.
- The housing is a rectangle that surrounds all three lights with padding. The padding is the same as the radius.
- The three lights are evenly spaced vertically inside the housing and the housing is spaced in the center of the image. (So the center of the yellow circle is the center of the image).

### Variables to derive

- `centerX` — the horizontal center of all lights
- `redY`, `yellowY`, `greenY` — the vertical centers of each light
- `housingX`, `housingY` — the top-left corner of the housing rectangle
- `housingWidth`, `housingHeight` — the size of the housing rectangle

All derived variables should be expressed as `radius * something`.
