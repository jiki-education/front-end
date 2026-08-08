---
title: "Weather Symbols"
description: "Draw a six-day weather forecast from a list of descriptions."
---

You've been asked to build a six-day weather forecast. However, rather than receiving traditional weather data, your boss is giving you descriptions of the weather based on how he feels about them (e.g. "Snowboarding time! 🏂" or "Miserable 😩").

You're given an <define>Array</define> of six weather descriptions, one per day, and your job is to draw each day's weather into its own box.

The forecast is shown as a grid of six boxes, one for each weekday from Monday to Saturday. The descriptions line up in order: the first (box `0`) is Monday's weather, the second (box `1`) is Tuesday's, and so on through to Saturday (box `5`). (Your boss doesn't leave the house on Sundays so he doesn't bother about the weather, and so we can never report it...)

## Drawing a day

We've given you a <define>`draw`</define> function that does all the artwork for you. Your job is to work out the right elements to put inside.

```js
draw(box, day, elements)
```

- `box` is the box to draw into (`0` to `5`).
- `day` is the weekday to label the box with, for example `"Monday"`.
- `elements` is an Array of weather symbols to show (see below for details).

The weekdays, in order, are `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"`, and `"Saturday"`.

So if the first day is `"Exciting 🤩"`, you'd write:

```js
draw(0, "Monday", ["cloud", "snow"])
```

## What each description means

Every description maps to a specific Array of symbols:

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## Your task

Work through the `days` list one day at a time. For each description, turn it into the right list of symbols and `draw` it into that day's box, labelled with the matching weekday.
