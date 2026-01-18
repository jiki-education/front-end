function startsWith(word, substr) {
  if (substr.length > word.length) {
    return false;
  }

  for (let i = 0; i < substr.length; i++) {
    if (substr[i] !== word[i]) {
      return false;
    }
  }

  if (substr.length === word.length || word[substr.length] === " ") {
    return true;
  }
  return false;
}

function onGuestList(names, person) {
  for (const name of names) {
    if (startsWith(name, person)) {
      return true;
    }
  }
  return false;
}
