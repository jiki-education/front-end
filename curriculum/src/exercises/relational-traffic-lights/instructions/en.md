---
title: "Relational Traffic Lights"
description: "Rebuild your traffic light so everything scales together."
---

You're back with the traffic lights! This time, we're going to build the traffic lights so that as we change the radius, they rescale correctly. To achieve this we have a series of variables we can set to be relative to either/both `center` and `radius`.

<img src="/static/images/exercise-assets/relational-traffic-lights/target.webp" alt="Target traffic light" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### How it works

- The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
- The color variables and `center` are fixed for you. The `radius` is preset to 10, but you can experiment with changing it.
- You need to derive all position and size variables as some combination of `radius` and/or `center`.
- The housing is a rectangle that surrounds all three lights with padding. The padding is the same as the radius.
- The three lights are evenly spaced vertically inside the housing and the housing is in the center of the image. (So the center of the yellow circle is the center of the image).

### Variables to derive

All of these variables should use either `radius` or `center` (e.g. some formula like `radius * 7` or `center - (radius * 2)`)

- `redY`, `yellowY`, `greenY` — the vertical centers of each light
- `housingX`, `housingY` — the top-left corner of the housing rectangle
- `housingWidth`, `housingHeight` — the size of the housing rectangle

### Testing the responsiveness

As you're working, you can change the radius from `2` - `12` to see whether things scale correctly. If your code is correct, you should see everything scale nicely around the center of the image!
