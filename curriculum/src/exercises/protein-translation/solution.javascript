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
  let result = [];
  let current = "";

  let counter = 0;
  for (const letter of rna) {
    counter = counter + 1;
    current = current + letter;

    if (counter % 3 === 0 && current !== "") {
      result.push(current);
      current = "";
    }
  }
  return result;
}

function translateRna(rna) {
  return codonsToProteins(rnaToCodons(rna));
}
