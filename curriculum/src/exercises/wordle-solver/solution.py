def has_key(dict, key):
    for k in dict:
        if key == k:
            return True
    return False

def contains(haystack, needle):
    for thing in haystack:
        if needle == thing:
            return True
    return False

def add_or_increment(things, thing):
    if not has_key(things, thing):
        things[thing] = 0
    things[thing] = things[thing] + 1
    return things

def letter_ok_in_guess(letter, knowledge, letter_knowledge):
    if letter_knowledge["actual"] != "":
        return letter == letter_knowledge["actual"]
    if contains(knowledge["absent"], letter):
        return False
    if contains(letter_knowledge["not"], letter):
        return False
    return True

def unique(list):
    res_list = []
    for elem in list:
        if not contains(res_list, elem):
            res_list.append(elem)
    return res_list

def is_word_possible(word, knowledge):
    for idx, char in enumerate(word):
        if not letter_ok_in_guess(char, knowledge, knowledge["squares"][idx]):
            return False
    for char in knowledge["present"]:
        if not contains(word, char):
            return False
    return True

def choose_word(knowledge):
    words = common_words()
    for candidate in words:
        if is_word_possible(candidate, knowledge):
            return candidate

def setup_knowledge():
    knowledge = {"present": [], "absent": [], "squares": [], "won": False}
    for idx in range(5):
        knowledge["squares"].append({"actual": "", "not": []})
    return knowledge

def has_won(states):
    for item in states:
        if item != "correct":
            return False
    return True

def should_be_present(present_letters, target_word, letter):
    if not has_key(present_letters, letter):
        return True
    actual = 0
    for char in target_word:
        if char == letter:
            actual = actual + 1
    return actual > present_letters[letter]

def process_guess(knowledge, row, guess):
    target = get_target_word()
    states = []
    present_letters = {}
    for idx, char in enumerate(guess):
        if target[idx] == char:
            knowledge["squares"][idx]["actual"] = char
            present_letters = add_or_increment(present_letters, char)
            states.append("correct")
        elif contains(target, char):
            knowledge["present"] = unique(knowledge["present"] + [char])
            knowledge["squares"][idx]["not"].append(char)
            states.append("present")
        else:
            knowledge["absent"] = unique(knowledge["absent"] + [char])
            states.append("absent")

    for idx, char in enumerate(guess):
        if states[idx] != "present":
            continue
        if should_be_present(present_letters, target, char):
            present_letters = add_or_increment(present_letters, char)
        else:
            states[idx] = "absent"

    knowledge["won"] = has_won(states)
    add_word(row, guess, states)
    return knowledge

def process_game():
    knowledge = setup_knowledge()
    for idx in range(1, 7):
        knowledge = process_guess(knowledge, idx, choose_word(knowledge))
        if knowledge["won"]:
            break