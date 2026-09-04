let present = []
let absent = []
let actuals = ["", "", "", "", ""]
let nots = [[], [], [], [], []]

function letterOkInGuess(letter, idx) {
  if (actuals[idx] !== "") {
    return letter === actuals[idx]
  }
  if (absent.includes(letter)) {
    return false
  }
  if (nots[idx].includes(letter)) {
    return false
  }
  return true
}

function isWordPossible(word) {
  for (let idx = 0; idx < word.length; idx++) {
    let char = word[idx]
    if (!letterOkInGuess(char, idx)) {
      return false
    }
  }
  for (const char of present) {
    if (!word.includes(char)) {
      return false
    }
  }
  return true
}

function chooseWord() {
  let words = commonWords()
  for (const candidate of words) {
    if (isWordPossible(candidate)) {
      return candidate
    }
  }
}

function isFoundElsewhere(word, states, letter) {
  for (let idx = 0; idx < word.length; idx++) {
    if (word[idx] === letter && states[idx] !== "absent") {
      return true
    }
  }
  return false
}

function recordKnowledge(word, states) {
  for (let idx = 0; idx < word.length; idx++) {
    let letter = word[idx]
    if (states[idx] === "correct") {
      actuals[idx] = letter
    } else if (states[idx] === "present") {
      if (!present.includes(letter)) {
        present.push(letter)
      }
      nots[idx].push(letter)
    } else if (!isFoundElsewhere(word, states, letter)) {
      if (!absent.includes(letter)) {
        absent.push(letter)
      }
    }
  }
}

function hasWon(states) {
  for (const state of states) {
    if (state !== "correct") {
      return false
    }
  }
  return true
}

function solveWordle() {
  for (let row = 1; row <= 6; row++) {
    let word = chooseWord()
    let states = guess(word)
    recordKnowledge(word, states)
    if (hasWon(states)) {
      break
    }
  }
}
