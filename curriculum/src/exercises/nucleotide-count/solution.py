def contains(lst, target):
    for item in lst:
        if item == target:
            return True
    return False


def count_nucleotides(dna):
    counts = {"A": 0, "C": 0, "G": 0, "T": 0}
    strand_types = list(counts.keys())
    for strand in dna:
        if not contains(strand_types, strand):
            return False

        counts[strand] = counts[strand] + 1

    return counts
