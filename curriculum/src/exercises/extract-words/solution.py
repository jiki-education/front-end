def extract_words(sentence):
    words = []
    word = ""
    for letter in sentence:
        if letter == " ":
            if word != "":
                words.append(word)
            word = ""
        elif letter == ".":
            pass
        else:
            word = word + letter
    if word != "":
        words.append(word)
    return words
