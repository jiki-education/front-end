def find_anagrams(target, possibilities):
    target_lower = target.lower()
    sorted_target = "".join(sorted(target_lower))
    results = []

    for word in possibilities:
        word_lower = word.lower()
        if target_lower != word_lower:
            sorted_word = "".join(sorted(word_lower))
            if sorted_target == sorted_word:
                results.append(word)

    return results
