def get_length(word):
    counter = 0
    for letter in word:
        counter = counter + 1
    return counter

def handle_guest(name, allowed_prefix):
    if get_length(allowed_prefix) > get_length(name):
        return False

    i = 0
    repeat(get_length(allowed_prefix)):
        if allowed_prefix[i] != name[i]:
            return False
        i = i + 1
    return True
