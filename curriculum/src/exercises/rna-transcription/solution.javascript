function transformStrand(strand) {
  const dna = ["A", "C", "G", "T"];
  const rna = ["U", "G", "C", "A"];

  for (let i = 0; i < dna.length; i++) {
    if (strand === dna[i]) {
      return rna[i];
    }
  }
}

function dnaToRna(dnaStr) {
  let rnaResult = "";
  for (const letter of dnaStr) {
    rnaResult = rnaResult + transformStrand(letter);
  }
  return rnaResult;
}
