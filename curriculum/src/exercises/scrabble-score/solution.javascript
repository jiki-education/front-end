function letterValues() {
  const values = [
    ["AEIOULNRST", 1],
    ["DG", 2],
    ["BCMP", 3],
    ["FHVWY", 4],
    ["K", 5],
    ["JX", 8],
    ["QZ", 10]
  ];

  const dict = {};
  for (const pair of values) {
    for (const letter of pair[0]) {
      dict[letter] = pair[1];
    }
  }
  return dict;
}

function scrabbleScore(word) {
  const scores = letterValues();
  let score = 0;
  for (const letter of word) {
    score = score + scores[letter.toUpperCase()];
  }
  return score;
}
