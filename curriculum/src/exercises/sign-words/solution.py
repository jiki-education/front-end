def sign_words(business_name):
    words = []
    for chunk in business_name.split(" "):
        if chunk != "":
            words.append(chunk)
    return words
