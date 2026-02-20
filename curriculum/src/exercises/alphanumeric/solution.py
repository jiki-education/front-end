def contains(haystack, needle):
    for element in haystack:
        if element == needle:
            return True
    return False

def is_alpha(string):
    for char in string:
        if not contains("QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm", char):
            return False
    return True

def is_numeric(string):
    for char in string:
        if not contains("0123456789", char):
            return False
    return True

def is_alphanumeric(string):
    for char in string:
        if is_alpha(char):
            continue
        if is_numeric(char):
            continue
        return False
    return True

def what_am_i(string):
    alpha = is_alpha(string)
    numeric = is_numeric(string)
    alphanumeric = is_alphanumeric(string)

    if alpha:
        return "Alpha"
    elif numeric:
        return "Numeric"
    elif alphanumeric:
        return "Alphanumeric"
    else:
        return "Unknown"
