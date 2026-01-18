def reverse(string):
    result = ""
    for letter in string:
        result = letter + result
    return result
