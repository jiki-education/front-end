function countNucleotide(strand, nucleotide) {
  let valid = "ACGT"
  if (!valid.includes(nucleotide)) {
    return -1
  }

  let count = 0
  for (const letter of strand) {
    if (!valid.includes(letter)) {
      return -1
    }
    if (letter === nucleotide) {
      count = count + 1
    }
  }
  return count
}
