def is_letter(character):
    return character in "abcdefghijklmnopqrstuvwxyz1234567890'"

def add_word(words, word):
    if word != "":
        words.append(word)
    return words

def extract_words(sentence):
    result = []
    current = ""
    for letter in sentence:
        if not is_letter(letter):
            result = add_word(result, current)
            current = ""
        else:
            current = current + letter
    return add_word(result, current)

def count_words(sentence):
    words = extract_words(sentence.lower())
    occurrences = {}

    for word in words:
        if word not in occurrences:
            occurrences[word] = 0
        occurrences[word] = occurrences[word] + 1
    return occurrences