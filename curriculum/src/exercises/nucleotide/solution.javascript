function contains(haystack, needle) {
  for (const item of haystack) {
    if (item === needle) {
      return true;
    }
  }
  return false;
}

function countNucleotide(strand, nucleotide) {
  let valid = "ACGT";
  if (!contains(valid, nucleotide)) {
    return -1;
  }

  let count = 0;
  for (const letter of strand) {
    if (!contains(valid, letter)) {
      return -1;
    }
    if (letter === nucleotide) {
      count = count + 1;
    }
  }
  return count;
}
