def length(list):
    counter = 0
    for x in list:
        counter = counter + 1
    return counter

def to_sentence(list):
    num_artists = length(list)
    res = ""
    idx = 0
    for word in list:
        res = res + word
        if idx < num_artists - 2:
            res = res + ", "
        elif idx == num_artists - 2:
            res = res + ", and "
        idx = idx + 1
    return res

def has_key(dict, key):
    for k in dict:
        if k == key:
            return True
    return False

def favorite_artists(username):
    url = "https://api.spotify.com/v1/users/" + username
    user_resp = fetch(url, {})
    if has_key(user_resp, "error"):
        return "Error: " + user_resp["error"]
    artist_urls = []
    for item in user_resp["items"]:
        artist_urls.append(item["urls"]["spotify_api"])

    artist_names = []
    for artist_url in artist_urls:
        artist_names.append(fetch(artist_url, {})["name"])

    res = username + "'s most listened to artists are: "
    return res + to_sentence(artist_names) + "!"
