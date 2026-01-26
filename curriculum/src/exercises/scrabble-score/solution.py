def letter_values():
    values = [
        ["AEIOULNRST", 1],
        ["DG", 2],
        ["BCMP", 3],
        ["FHVWY", 4],
        ["K", 5],
        ["JX", 8],
        ["QZ", 10]
    ]

    result = {}
    for pair in values:
        for letter in pair[0]:
            result[letter] = pair[1]
    return result

def scrabble_score(word):
    scores = letter_values()
    score = 0
    for letter in word:
        score = score + scores[letter.upper()]
    return score
