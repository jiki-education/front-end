def transform_strand(strand):
    dna = ["A", "C", "G", "T"]
    rna = ["U", "G", "C", "A"]

    for i in range(len(dna)):
        if strand == dna[i]:
            return rna[i]

def dna_to_rna(dna):
    rna = ""
    for letter in dna:
        rna = rna + transform_strand(letter)
    return rna
