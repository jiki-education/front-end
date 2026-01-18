function contains(list, target) {
  for (const item of list) {
    if (item === target) {
      return true;
    }
  }
  return false;
}

function countNucleotides(dna) {
  let counts = { A: 0, C: 0, G: 0, T: 0 };
  let strandTypes = Object.keys(counts);
  for (const strand of dna) {
    if (!contains(strandTypes, strand)) {
      return false;
    }

    counts[strand] = counts[strand] + 1;
  }

  return counts;
}
