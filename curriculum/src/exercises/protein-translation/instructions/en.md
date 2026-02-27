---
title: "Protein Translation"
description: ""
---

RNA can be broken into three-nucleotide sequences called codons, and then translated to a protein. For example:

1. RNA: "AUGUUUUCU"
2. Codons: "AUG", "UUU", "UCU"
3. Protein: "Methionine", "Phenylalanine", "Serine"

There are also three terminating codons (STOP codons: UAA, UAG, UGA). If you encounter any of these, all translation ends and the protein is terminated.

Your task is to write a function `translateRna` that takes an RNA sequence and returns the list of amino acids.

Codon mappings:

- AUG -> Methionine
- UUU, UUC -> Phenylalanine
- UUA, UUG -> Leucine
- UCU, UCC, UCA, UCG -> Serine
- UAU, UAC -> Tyrosine
- UGU, UGC -> Cysteine
- UGG -> Tryptophan
- UAA, UAG, UGA -> STOP
