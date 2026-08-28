function signWords(businessName) {
  let words = []
  for (const chunk of businessName.split(" ")) {
    if (chunk !== "") {
      words.push(chunk)
    }
  }
  return words
}
