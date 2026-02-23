function isLetter(character) {
  return "abcdefghijklmnopqrstuvwxyz1234567890'".includes(character);
}

function addWord(words, word) {
  if (word !== "") {
    words.push(word);
  }
  return words;
}

function extractWords(sentence) {
  let result = [];
  let current = "";
  for (const letter of sentence) {
    if (!isLetter(letter)) {
      result = addWord(result, current);
      current = "";
    } else {
      current = current + letter;
    }
  }
  return addWord(result, current);
}

function countWords(sentence) {
  let words = extractWords(sentence.toLowerCase());
  let occurrences = {};

  for (const word of words) {
    if (!(word in occurrences)) {
      occurrences[word] = 0;
    }
    occurrences[word] = occurrences[word] + 1;
  }
  return occurrences;
}