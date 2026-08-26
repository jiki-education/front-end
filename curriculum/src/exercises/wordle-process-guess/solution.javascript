function processLetter(letter, idx, target) {
  if (target[idx] === letter) {
    return "correct"
  } else if (target.includes(letter)) {
    return "present"
  } else {
    return "absent"
  }
}
function processGuess(target, guess) {
  let states = []
  for (let idx = 0; idx < guess.length; idx++) {
    states.push(processLetter(guess[idx], idx, target))
  }
  colorRow(1, states)
}