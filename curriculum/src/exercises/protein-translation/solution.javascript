function codonsToProteins(codons) {
  let map = {
    AUG: "Methionine",
    UUU: "Phenylalanine",
    UUC: "Phenylalanine",
    UUA: "Leucine",
    UUG: "Leucine",
    UCU: "Serine",
    UCC: "Serine",
    UCA: "Serine",
    UCG: "Serine",
    UAU: "Tyrosine",
    UAC: "Tyrosine",
    UGU: "Cysteine",
    UGC: "Cysteine",
    UGG: "Tryptophan",
    UAA: "STOP",
    UAG: "STOP",
    UGA: "STOP"
  };
  let proteins = [];
  for (const codon of codons) {
    if (map[codon] === "STOP") {
      break;
    }
    proteins.push(map[codon]);
  }
  return proteins;
}

function rnaToCodons(rna) {
  let codons = [];
  let codon = "";

  let counter = 0;
  for (const letter of rna) {
    counter = counter + 1;
    codon = codon + letter;

    if (counter % 3 === 0 && codon !== "") {
      codons.push(codon);
      codon = "";
    }
  }
  return codons;
}

function translateRna(rna) {
  return codonsToProteins(rnaToCodons(rna));
}
