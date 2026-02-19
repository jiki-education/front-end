function hasKey(dict, key) {
  for (const k of Object.keys(dict)) {
    if (key === k) {
      return true;
    }
  }
  return false;
}

function contains(haystack, needle) {
  for (const thing of haystack) {
    if (needle === thing) {
      return true;
    }
  }
  return false;
}

function addOrIncrement(things, thing) {
  if (!hasKey(things, thing)) {
    things[thing] = 0;
  }
  things[thing] = things[thing] + 1;
  return things;
}

function letterOkInGuess(letter, knowledge, letterKnowledge) {
  if (letterKnowledge["actual"] !== "") {
    return letter === letterKnowledge["actual"];
  }
  if (contains(knowledge["absent"], letter)) {
    return false;
  }
  if (contains(letterKnowledge["not"], letter)) {
    return false;
  }
  return true;
}

function unique(list) {
  let resList = [];
  for (const elem of list) {
    if (!contains(resList, elem)) {
      resList.push(elem);
    }
  }
  return resList;
}

function isWordPossible(word, knowledge) {
  for (let idx = 0; idx < word.length; idx++) {
    let letter = word[idx];
    if (!letterOkInGuess(letter, knowledge, knowledge["squares"][idx])) {
      return false;
    }
  }
  for (const letter of knowledge["present"]) {
    if (!contains(word, letter)) {
      return false;
    }
  }
  return true;
}

function chooseWord(knowledge) {
  let words = commonWords();
  for (const word of words) {
    if (isWordPossible(word, knowledge)) {
      return word;
    }
  }
}

function setupKnowledge() {
  let knowledge = { present: [], absent: [], squares: [], won: false };
  repeat(5) {
    knowledge["squares"].push({ actual: "", not: [] });
  }
  return knowledge;
}

function hasWon(states) {
  for (const item of states) {
    if (item !== "correct") {
      return false;
    }
  }
  return true;
}

function shouldBePresent(presentLetters, targetWord, letter) {
  if (!hasKey(presentLetters, letter)) {
    return true;
  }
  let actual = 0;
  for (const char of targetWord) {
    if (char === letter) {
      actual = actual + 1;
    }
  }
  return actual > presentLetters[letter];
}

function processGuess(knowledge, row, guess) {
  let target = getTargetWord();
  let states = [];
  let presentLetters = {};
  for (let idx = 0; idx < guess.length; idx++) {
    let letter = guess[idx];
    if (target[idx] === letter) {
      knowledge["squares"][idx]["actual"] = letter;
      presentLetters = addOrIncrement(presentLetters, letter);
      states.push("correct");
    } else if (contains(target, letter)) {
      knowledge["present"] = unique([...knowledge["present"], letter]);
      knowledge["squares"][idx]["not"].push(letter);
      states.push("present");
    } else {
      knowledge["absent"] = unique([...knowledge["absent"], letter]);
      states.push("absent");
    }
  }

  for (let idx = 0; idx < guess.length; idx++) {
    let letter = guess[idx];
    if (states[idx] !== "present") {
      continue;
    }
    if (shouldBePresent(presentLetters, target, letter)) {
      presentLetters = addOrIncrement(presentLetters, letter);
    } else {
      states[idx] = "absent";
    }
  }

  knowledge["won"] = hasWon(states);
  addWord(row, guess, states);
  return knowledge;
}

function processGame() {
  let knowledge = setupKnowledge();
  for (let idx = 1; idx <= 6; idx++) {
    knowledge = processGuess(knowledge, idx, chooseWord(knowledge));
    if (knowledge["won"]) {
      break;
    }
  }
}