def index_of(text, target):
    idx = 0
    for char in text:
        if char == target:
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
    for char in message:
        if char == " ":
            result = result + " "
        else:
            result = result + shift_letter(char, shift)
    return result
