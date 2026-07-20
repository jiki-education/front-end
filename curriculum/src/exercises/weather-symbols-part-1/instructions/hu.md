---
title: "Weather Symbols (Part 1)"
description: "Map weather descriptions to the right combination of symbols."
---

We're going to draw a range of weather symbols, made up of smaller components. It's split into two parts.

In this first part, take a weather description (like `sunny` or `rainbow-territory`) and turn it into a list of the components that need drawing.

This is how they should map:

- `"sunny"`: `["sun"]`
- `"dull"`: `["cloud"]`
- `"miserable"`: `["cloud", "rain"]`
- `"hopeful"`: `["sun", "cloud"]`
- `"rainbow-territory"`: `["sun", "cloud", "rain"]`
- `"exciting"`: `["cloud", "snow"]`
- `"snowboarding-time"`: `["sun", "cloud", "snow"]`

Create a function called `descriptionToElements(description)`. It takes the description as a string input and returns the list of components to draw.
