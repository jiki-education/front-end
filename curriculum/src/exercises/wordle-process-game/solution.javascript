function countLetter(letters, target) {
  let count = 0
  for (const letter of letters) {
    if (letter === target) {
      count = count + 1
    }
  }
  return count
}

function processGame(word, guesses) {
  for (let idx = 0; idx < guesses.length; idx++) {
    colorRow(idx + 1, processGuess(word, guesses[idx]))
  }
}

function processGuess(word, guess) {
  let states = []
  let claimed = []

  for (let idx = 0; idx < guess.length; idx++) {
    if (word[idx] === guess[idx]) {
      states.push("correct")
      claimed.push(guess[idx])
    } else {
      states.push("absent")
    }
  }

  for (let idx = 0; idx < guess.length; idx++) {
    if (states[idx] === "correct") {
      continue
    }
    let letter = guess[idx]
    if (countLetter(word, letter) > countLetter(claimed, letter)) {
      states[idx] = "present"
      claimed.push(letter)
    }
  }

  return states
}
