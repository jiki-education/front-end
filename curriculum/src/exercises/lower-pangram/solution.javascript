function includes(haystack, needle) {
  for (const character of haystack) {
    if (needle === character) {
      return true
    }
  }
  return false
}

function isPangram(sentence) {
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!includes(sentence, letter)) {
      return false
    }
  }
  return true
}
