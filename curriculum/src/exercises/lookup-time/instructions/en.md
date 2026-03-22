---
title: "Lookup Time"
description: "Look up the current time for a city."
---

Create a function called getTime which takes a city as its input, uses the fetch function to get the time in that city, then returns it as part of a string.

The URL of the API is "https://timeapi.io/api/time/current/city".
The params for fetch should have one key "city" set to the string passed into getTime.

You should turn the response into a string formatted like: "The time on this Sunday in Amsterdam is 00:28"

If the response contains an "error" key, return the error message instead.
