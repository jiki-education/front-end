---
title: "Weather Symbols (Part 2)"
description: ""
---

In Part 1, you mapped weather descriptions to lists of components. Now it's time to draw them!

Create a function called `drawWeather(elements)` that takes a list of weather elements and draws the corresponding scene.

The elements list can contain: `"sun"`, `"cloud"`, `"rain"`, and `"snow"`.

### Drawing Rules

**Always start by drawing the sky**: a light blue rectangle covering the whole canvas.

**Sun** has two sizes:

- If there's NO cloud in the elements, draw a **large sun**: `circle(50, 50, 25, "#ffed06")`
- If there IS a cloud, draw a **small sun**: `circle(75, 30, 15, "#ffed06")`

**Cloud** is made of:

- `rectangle(25, 50, 50, 10, "#FFFFFF")`
- `circle(25, 50, 10, "#FFFFFF")`
- `circle(40, 40, 15, "#FFFFFF")`
- `circle(55, 40, 20, "#FFFFFF")`
- `circle(75, 50, 10, "#FFFFFF")`

**Rain** drops:

- `ellipse(30, 70, 3, 5, "#56AEFF")`
- `ellipse(50, 70, 3, 5, "#56AEFF")`
- `ellipse(70, 70, 3, 5, "#56AEFF")`
- `ellipse(40, 80, 3, 5, "#56AEFF")`
- `ellipse(60, 80, 3, 5, "#56AEFF")`

**Snow** flakes:

- `circle(30, 70, 5, "#56AEFF")`
- `circle(50, 70, 5, "#56AEFF")`
- `circle(70, 70, 5, "#56AEFF")`
- `circle(40, 80, 5, "#56AEFF")`
- `circle(60, 80, 5, "#56AEFF")`

### Quick Reminder

- `rectangle(left, top, width, height, color)` -- draws a rectangle
- `circle(cx, cy, radius, color)` -- draws a circle
- `ellipse(cx, cy, rx, ry, color)` -- draws an ellipse

The top-left of the drawing canvas is `0,0`. The bottom-right is `100,100`.
