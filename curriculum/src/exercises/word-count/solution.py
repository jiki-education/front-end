def is_letter(character):
    return character in "abcdefghijklmnopqrstuvwxyz1234567890'"

def add_word(words, word):
    if word != "":
        words.append(word)
    return words

def extract_words(sentence):
    words = []
    word = ""
    for letter in sentence:
        if not is_letter(letter):
            words = add_word(words, word)
            word = ""
        else:
            word = word + letter
    return add_word(words, word)

def count_words(sentence):
    words = extract_words(sentence.lower())
    occurrences = {}

    for word in words:
        if word not in occurrences:
            occurrences[word] = 0
        occurrences[word] = occurrences[word] + 1
    return occurrences