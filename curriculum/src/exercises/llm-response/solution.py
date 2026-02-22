def contains(haystack, needle):
    for thread in haystack:
        if needle == thread:
            return True
    return False

def extract_number(string):
    numbers = "0123456789"
    res = ""
    for letter in string:
        if not contains(numbers, letter):
            break
        res = res + letter
    return int(res)

def select_answer(answers):
    best_answer = {}
    best_certainty = 0
    answer_certainty = 0

    for answer in answers:
        answer_certainty = float(answer["certainty"])
        if answer_certainty > best_certainty:
            best_answer = answer
            best_certainty = answer_certainty
    return best_answer

def ask_llm(question):
    data = fetch("https://myllm.com/api/v2/qanda", {"question": question})
    answers = data["response"]["answers"]
    time_ms = data["meta"]["time"]
    time_s = str(extract_number(time_ms) / 1000)

    answer = select_answer(answers)
    certainty_pc = str(float(answer["certainty"]) * 100)

    extra = certainty_pc + "% certainty in " + time_s + "s"
    return "The answer to '" + question + "' is '" + answer["text"] + "' (" + extra + ")."
