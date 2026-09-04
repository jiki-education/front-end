present = []
absent = []
actuals = ["", "", "", "", ""]
nots = [[], [], [], [], []]

def letter_ok_in_guess(letter, idx):
    if actuals[idx] != "":
        return letter == actuals[idx]
    if letter in absent:
        return False
    return letter not in nots[idx]

def is_word_possible(word):
    for idx, char in enumerate(word):
        if not letter_ok_in_guess(char, idx):
            return False
    for char in present:
        if char not in word:
            return False
    return True

def choose_word():
    for candidate in common_words():
        if is_word_possible(candidate):
            return candidate

def is_found_elsewhere(word, states, letter):
    for idx, char in enumerate(word):
        if char == letter and states[idx] != "absent":
            return True
    return False

def record_knowledge(word, states):
    for idx, letter in enumerate(word):
        if states[idx] == "correct":
            actuals[idx] = letter
        elif states[idx] == "present":
            if letter not in present:
                present.append(letter)
            nots[idx].append(letter)
        elif not is_found_elsewhere(word, states, letter):
            if letter not in absent:
                absent.append(letter)

def has_won(states):
    for state in states:
        if state != "correct":
            return False
    return True

def solve_wordle():
    for _ in range(6):
        word = choose_word()
        states = guess(word)
        record_knowledge(word, states)
        if has_won(states):
            break
