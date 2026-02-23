function contains(haystack, needle) {
  for (const thing of haystack) {
    if (needle === thing) {
      return true;
    }
  }
  return false;
}

function processGuess(word, guess) {
  let states = [];
  for (let idx = 0; idx < guess.length; idx++) {
    let letter = guess[idx];
    if (word[idx] === letter) {
      states.push("correct");
    } else if (contains(word, letter)) {
      states.push("present");
    } else {
      states.push("absent");
    }
  }
  colorRow(1, states);
}