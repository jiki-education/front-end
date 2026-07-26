def count_nucleotide(strand, nucleotide):
    valid = "ACGT"
    if nucleotide not in valid:
        return -1

    count = 0
    for letter in strand:
        if letter not in valid:
            return -1
        if letter == nucleotide:
            count = count + 1
    return count
