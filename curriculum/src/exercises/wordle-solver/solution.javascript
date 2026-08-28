let present = []
let absent = []
let squares = [
  { actual: "", not: [] },
  { actual: "", not: [] },
  { actual: "", not: [] },
  { actual: "", not: [] },
  { actual: "", not: [] }
]

function letterOkInGuess(letter, letterKnowledge) {
  if (letterKnowledge["actual"] !== "") {
    return letter === letterKnowledge["actual"]
  }
  if (absent.includes(letter)) {
    return false
  }
  if (letterKnowledge["not"].includes(letter)) {
    return false
  }
  return true
}

function isWordPossible(word) {
  for (let idx = 0; idx < word.length; idx++) {
    let char = word[idx]
    if (!letterOkInGuess(char, squares[idx])) {
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
      squares[idx]["actual"] = letter
    } else if (states[idx] === "present") {
      if (!present.includes(letter)) {
        present.push(letter)
      }
      squares[idx]["not"].push(letter)
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
