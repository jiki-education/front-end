function getLength(someString) {
  let counter = 0
  for (const letter of someString) {
    counter = counter + 1
  }
  return counter
}

function handleGuest(name, allowedPrefix) {
  if (getLength(allowedPrefix) > getLength(name)) {
    return false
  }

  let i = 0
  repeat(getLength(allowedPrefix)) {
    if (allowedPrefix[i] !== name[i]) {
      return false
    }
    i = i + 1
  }
  return true
}
