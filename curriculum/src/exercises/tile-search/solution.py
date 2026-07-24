def contains(haystack, needle):
    for letter in haystack:
        if letter == needle:
            return True
    return False