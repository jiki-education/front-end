function length(list) {
  let counter = 0;
  for (const x of list) {
    counter = counter + 1;
  }
  return counter;
}

function toSentence(list) {
  let numArtists = length(list);
  let res = "";
  let idx = 0;
  for (const word of list) {
    res = res + word;
    if (idx < numArtists - 2) {
      res = res + ", ";
    } else if (idx === numArtists - 2) {
      res = res + ", and ";
    }
    idx = idx + 1;
  }
  return res;
}

function hasKey(dict, key) {
  for (const k in dict) {
    if (k === key) {
      return true;
    }
  }
  return false;
}

function favoriteArtists(username) {
  let url = "https://api.spotify.com/v1/users/" + username;
  let userResp = fetch(url, {});
  if (hasKey(userResp, "error")) {
    return "Error: " + userResp["error"];
  }
  let artistUrls = [];
  for (const item of userResp["items"]) {
    artistUrls.push(item["urls"]["spotify_api"]);
  }

  let artistNames = [];
  for (const artistUrl of artistUrls) {
    artistNames.push(fetch(artistUrl, {})["name"]);
  }

  let res = username + "'s most listened to artists are: ";
  return res + toSentence(artistNames) + "!";
}
