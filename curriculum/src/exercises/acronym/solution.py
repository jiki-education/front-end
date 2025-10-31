def acronym(phrase):
    words = split(phrase, " ")
    letters = []

    for word in words:
        if length(word) > 0:
            first_letter = char_at(word, 0)
            upper_letter = to_upper_case(first_letter)
            letters.append(upper_letter)

    return join(letters, "")
