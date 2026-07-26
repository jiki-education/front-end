function includes(haystack, needle) {
  for (const character of haystack) {
    if (needle === character) {
      return true
    }
  }
  return false
}

function indexOf(haystack, needle) {
  let idx = 0
  for (const letter of haystack) {
    if (needle === letter) {
      return idx
    }
    idx = idx + 1
  }
  return -1
}

function toLowerCase(someString) {
  let output = ""
  let lower = "abcdefghijklmnopqrstuvwxyz"
  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let upperIdx = 0
  for (const char of someString) {
    if (includes(lower, char)) {
      output = output + char
    } else {
      upperIdx = indexOf(upper, char)
      if (upperIdx !== -1) {
        output = output + lower[upperIdx]
      }
    }
  }
  return output
}

function isPangram(sentence) {
  sentence = toLowerCase(sentence)
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!includes(sentence, letter)) {
      return false
    }
  }
  return true
}
