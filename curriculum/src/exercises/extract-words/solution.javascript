function extractWords(sentence) {
  let words = [];
  let word = "";
  for (const letter of sentence) {
    if (letter === " ") {
      if (word !== "") {
        words.push(word);
      }
      word = "";
    } else if (letter === ".") {
      // skip periods
    } else {
      word = word + letter;
    }
  }
  if (word !== "") {
    words.push(word);
  }
  return words;
}
