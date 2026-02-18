function indexOf(text, target) {
  let idx = 0
  for (const letter of text) {
    if (letter === target) {
      return idx
    }
    idx = idx + 1
  }
  return -1
}

function shiftLetter(letter, amount) {
  let alphabet = "abcdefghijklmnopqrstuvwxyz"
  let pos = indexOf(alphabet, letter)
  if (pos === -1) {
    return letter
  }
  let newPos = (pos + amount) % 26
  return alphabet[newPos]
}

function encode(message, shift) {
  let result = ""
  for (const letter of message) {
    if (letter === " ") {
      result = result + " "
    } else {
      result = result + shiftLetter(letter, shift)
    }
  }
  return result
}
