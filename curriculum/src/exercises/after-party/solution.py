def starts_with(word, substr):
    if len(substr) > len(word):
        return False

    for i in range(len(substr)):
        if substr[i] != word[i]:
            return False

    if len(substr) == len(word) or word[len(substr)] == " ":
        return True
    return False

def on_guest_list(names, person):
    for name in names:
        if starts_with(name, person):
            return True
    return False
