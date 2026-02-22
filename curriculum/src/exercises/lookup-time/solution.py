def has_key(dict, key):
    for k in dict:
        if k == key:
            return True
    return False

def get_time(city):
    data = fetch("https://timeapi.io/api/time/current/city", {"city": city})
    if has_key(data, "error"):
        return data["error"]
    return "The time on this " + data["dayOfWeek"] + " in " + city + " is " + data["time"]