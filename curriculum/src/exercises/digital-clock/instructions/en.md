---
title: "Digital Clock"
description: "Display the correct time on a 12-hour digital clock."
---

In this exercise you're going to use two new functions to get the time:

- `currentTimeHour()`: Returns the current hour using 24-hour time (e.g. 15 minutes to midnight would return `23`) as a number.
- `currentTimeMinute()`: Returns the current minute as a number.

Your job is to update a digital clock based on whatever numbers those functions return.

The digital clock expects the numbers to be in a 12-hour format with an `am` or `pm` (what's called the "meridiem").

So for example:

- `7:45` -> `7:45am`
- `19:45` -> `7:45pm`

To display the time on the clock you use the `displayTime(hour, minutes, meridiem)` function.

In each scenario, the current time changes. Your job is to write code that makes all the scenarios work. In the final scenario, we use the actual real time, so the scenario will change every time the the real time moves on by a minute!
