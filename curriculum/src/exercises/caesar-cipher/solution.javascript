function indexOf(text, target) {
  let idx = 0
  for (const char of text) {
    if (char === target) {
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
  for (const char of message) {
    if (char === " ") {
      result = result + " "
    } else {
      result = result + shiftLetter(char, shift)
    }
  }
  return result
}
