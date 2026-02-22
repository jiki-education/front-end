def contains(haystack, needle):
    for item in haystack:
        if item == needle:
            return True
    return False


def count_nucleotide(strand, nucleotide):
    valid = "ACGT"
    if not contains(valid, nucleotide):
        return -1

    count = 0
    for letter in strand:
        if not contains(valid, letter):
            return -1
        if letter == nucleotide:
            count = count + 1
    return count
