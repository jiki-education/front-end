def contains(string, target):
    for character in string:
        if target == character:
            return True
    return False


def index_of(sentence, target):
    idx = 0
    for letter in sentence:
        if target == letter:
            return idx
        idx = idx + 1
    return -1


def to_lower(sentence):
    output = ""
    lower = "abcdefghijklmnopqrstuvwxyz"
    upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    upper_idx = 0
    for char in sentence:
        if contains(lower, char):
            output = output + char
        else:
            upper_idx = index_of(upper, char)
            if upper_idx != -1:
                output = output + lower[upper_idx]
    return output


def is_pangram(sentence):
    sentence = to_lower(sentence)
    for letter in "abcdefghijklmnopqrstuvwxyz":
        if not contains(sentence, letter):
            return False
    return True
