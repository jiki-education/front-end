function isLetter(character) {
  return "abcdefghijklmnopqrstuvwxyz1234567890".includes(character)
}

function addWord(words, word) {
  if (word !== "") {
    words.push(word)
  }
  return words
}

function extractWords(sentence) {
  let result = []
  let current = ""
  for (let i = 0; i < sentence.length; i = i + 1) {
    const ch = sentence[i]

    let nextIsLetter = false
    if (i + 1 < sentence.length) {
      nextIsLetter = isLetter(sentence[i + 1])
    }

    if (isLetter(ch)) {
      current = current + ch
    } else if (ch === "'" && current !== "" && nextIsLetter) {
      current = current + ch
    } else {
      result = addWord(result, current)
      current = ""
    }
  }
  return addWord(result, current)
}

function countWords(sentence) {
  let words = extractWords(sentence.toLowerCase())
  let occurrences = {}

  for (const word of words) {
    if (!(word in occurrences)) {
      occurrences[word] = 0
    }
    occurrences[word] = occurrences[word] + 1
  }
  return occurrences
}
