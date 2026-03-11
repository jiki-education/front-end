function contains(haystack, needle) {
  for (const thing of haystack) {
    if (needle === thing) {
      return true;
    }
  }
  return false;
}

function processGame(word, guesses) {
  for (let idx = 0; idx < guesses.length; idx++) {
    colorRow(idx + 1, processGuess(word, guesses[idx]));
  }
}

function processFirstGuess(word, guess) {
  processGame(word, [guess]);
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
  return states;
}