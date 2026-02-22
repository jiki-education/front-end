def codons_to_proteins(codons):
    codon_map = {
        "AUG": "Methionine",
        "UUU": "Phenylalanine",
        "UUC": "Phenylalanine",
        "UUA": "Leucine",
        "UUG": "Leucine",
        "UCU": "Serine",
        "UCC": "Serine",
        "UCA": "Serine",
        "UCG": "Serine",
        "UAU": "Tyrosine",
        "UAC": "Tyrosine",
        "UGU": "Cysteine",
        "UGC": "Cysteine",
        "UGG": "Tryptophan",
        "UAA": "STOP",
        "UAG": "STOP",
        "UGA": "STOP"
    }
    proteins = []
    for codon in codons:
        if codon_map[codon] == "STOP":
            break
        proteins.append(codon_map[codon])
    return proteins


def rna_to_codons(rna):
    result = []
    current = ""

    counter = 0
    for letter in rna:
        counter = counter + 1
        current = current + letter

        if counter % 3 == 0 and current != "":
            result.append(current)
            current = ""

    return result


def translate_rna(rna):
    return codons_to_proteins(rna_to_codons(rna))
