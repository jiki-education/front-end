def includes(str, target):
    for character in str:
        if target == character:
            return True
    return False

def is_pangram(sentence):
    for letter in "abcdefghijklmnopqrstuvwxyz":
        if not includes(sentence, letter):
            return False
    return True
