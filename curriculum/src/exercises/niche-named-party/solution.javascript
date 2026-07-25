function getLength(word) {
  let counter = 0
  for (const letter of word) {
    counter = counter + 1
  }
  return counter
}

function handleGuest(name, allowedPrefix) {
  let i = 0
  repeat(getLength(allowedPrefix)) {
    if (allowedPrefix[i] !== name[i]) {
      return false
    }
    i = i + 1
  }
  return true
}
