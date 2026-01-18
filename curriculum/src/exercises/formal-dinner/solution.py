def remove_honorific(name):
    adding = False
    res = ""
    for letter in name:
        if adding:
            res = res + letter
        if letter == " ":
            adding = True
    return res

def ends_with(word, substr):
    if len(substr) > len(word):
        return False

    counter = len(word) - len(substr)
    for letter in substr:
        if word[counter] != letter:
            return False
        counter = counter + 1
    return True

def on_guest_list(names, person):
    for name in names:
        if ends_with(name, remove_honorific(person)):
            return True
    return False
