def acronym(phrase):
    output = ""
    was_space = True

    for letter in phrase:
        if letter == " " or letter == "-":
            was_space = True
        elif was_space and letter.isalpha():
            output = output + letter
            was_space = False

    return output.upper()
