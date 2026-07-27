function includes(text, target) {
  for (const character of text) {
    if (target === character) {
      return true
    }
  }
  return false
}

function indexOf(text, target) {
  let idx = 0
  for (const character of text) {
    if (target === character) {
      return idx
    }
    idx = idx + 1
  }
  return -1
}

function toAcronymLetter(char) {
  let lower = "abcdefghijklmnopqrstuvwxyz"
  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  if (includes(upper, char)) {
    return char
  }
  let idx = indexOf(lower, char)
  if (idx === -1) {
    return ""
  }
  return upper[idx]
}

function acronym(phrase) {
  let result = ""
  let isNewWord = true
  for (const char of phrase) {
    if (char === " " || char === "-") {
      isNewWord = true
    } else if (isNewWord) {
      let letter = toAcronymLetter(char)
      if (letter !== "") {
        result = result + letter
        isNewWord = false
      }
    }
  }
  return result
}
