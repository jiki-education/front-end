def plus_ones_for(names, plus_ones, person):
    for i in range(len(names)):
        if names[i] == person or names[i].startswith(person + " "):
            return plus_ones[i]
    return "Not on the list!"
