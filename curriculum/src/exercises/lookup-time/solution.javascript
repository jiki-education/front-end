function hasKey(dict, key) {
  for (const k in dict) {
    if (k === key) {
      return true;
    }
  }
  return false;
}

function getTime(city) {
  let data = fetch("https://timeapi.io/api/time/current/city", { city: city });
  if (hasKey(data, "error")) {
    return data["error"];
  }
  return "The time on this " + data["dayOfWeek"] + " in " + city + " is " + data["time"];
}