---
title: "Spotify Data"
description: ""
---

In this exercise, you'll parse data from a mock Spotify API.

The API requires two types of requests:

1. **User request**: Fetch a user's favorite tracks from `https://api.spotify.com/v1/users/{username}`. This returns a dictionary with an `items` list, where each item has a `urls` dictionary containing a `spotify_api` URL.

2. **Artist request**: Fetch artist details from the URL in the previous response. This returns a dictionary with a `name` key.

Create a function called `favoriteArtists` that takes a username and returns a sentence like:

```
"fred's most listened to artists are: Glee, NSYNC, Beethoven, and Limp Bizkit!"
```

If there is an error from the API, return the error prefixed with `"Error: "`.

The `fetch(url, params)` function is provided. For this exercise, params should always be an empty dictionary `{}`.
