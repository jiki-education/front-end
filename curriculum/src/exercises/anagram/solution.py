def find_anagrams(target, possibilities):
    lower_target = target.lower()
    sorted_target = ''.join(sorted(lower_target))
    results = []

    for candidate in possibilities:
        lower_candidate = candidate.lower()

        # Skip if it's the same word (case-insensitive)
        if lower_target == lower_candidate:
            continue

        # Check if it's an anagram by comparing sorted versions
        sorted_candidate = ''.join(sorted(lower_candidate))
        if sorted_target == sorted_candidate:
            results.append(candidate)

    # Sort results alphabetically (case-insensitive)
    return sorted(results, key=lambda x: x.lower())
