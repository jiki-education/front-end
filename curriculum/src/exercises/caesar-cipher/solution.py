def index_of(text, target):
    idx = 0
    for letter in text:
        if letter == target:
            return idx
        idx = idx + 1
    return -1

def shift_letter(letter, amount):
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    pos = index_of(alphabet, letter)
    if pos == -1:
        return letter
    new_pos = (pos + amount) % 26
    return alphabet[new_pos]

def encode(message, shift):
    result = ""
    for letter in message:
        if letter == " ":
            result = result + " "
        else:
            result = result + shift_letter(letter, shift)
    return result
