def contains(haystack, needle):
    for thing in haystack:
        if needle == thing:
            return True
    return False

def process_game(word, guesses):
    for idx, guess in enumerate(guesses):
        color_row(idx + 1, process_guess(word, guess))

def process_first_guess(word, guess):
    process_game(word, [guess])

def process_guess(word, guess):
    states = []
    for idx, letter in enumerate(guess):
        if word[idx] == letter:
            states.append("correct")
        elif contains(word, letter):
            states.append("present")
        else:
            states.append("absent")
    return states