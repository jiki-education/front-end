def includes(text, target):
    for character in text:
        if target == character:
            return True
    return False


def index_of(text, target):
    idx = 0
    for character in text:
        if target == character:
            return idx
        idx = idx + 1
    return -1


def to_acronym_letter(char):
    lower = "abcdefghijklmnopqrstuvwxyz"
    upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if includes(upper, char):
        return char
    idx = index_of(lower, char)
    if idx == -1:
        return ""
    return upper[idx]


def acronym(phrase):
    result = ""
    is_new_word = True
    for char in phrase:
        if char == " " or char == "-":
            is_new_word = True
        elif is_new_word:
            letter = to_acronym_letter(char)
            if letter != "":
                result = result + letter
                is_new_word = False
    return result
