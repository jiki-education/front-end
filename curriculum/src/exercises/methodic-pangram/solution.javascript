function isPangram(sentence) {
  sentence = sentence.toLowerCase()
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!sentence.includes(letter)) {
      return false
    }
  }
  return true
}
