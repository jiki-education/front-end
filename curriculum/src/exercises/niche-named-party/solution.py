def get_length(word):
    counter = 0
    for letter in word:
        counter = counter + 1
    return counter

def starts_with(name, prefix):
    if get_length(prefix) > get_length(name):
        return False

    i = 0
    repeat(get_length(prefix)):
        if prefix[i] != name[i]:
            return False
        i = i + 1
    return True

name = ask_name()
allowed_start = get_allowed_start()

if starts_with(name, allowed_start):
    let_in()
else:
    turn_away()
