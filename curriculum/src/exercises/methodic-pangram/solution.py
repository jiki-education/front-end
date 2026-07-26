def is_pangram(sentence):
    sentence = sentence.lower()
    for letter in "abcdefghijklmnopqrstuvwxyz":
        if letter not in sentence:
            return False
    return True
