function removeHonorific(name) {
  let adding = false;
  let res = "";
  for (const letter of name) {
    if (adding) {
      res = res + letter;
    }
    if (letter === " ") {
      adding = true;
    }
  }
  return res;
}

function endsWith(word, substr) {
  if (substr.length > word.length) {
    return false;
  }

  let counter = word.length - substr.length;
  for (const letter of substr) {
    if (word[counter] !== letter) {
      return false;
    }
    counter = counter + 1;
  }
  return true;
}

function onGuestList(names, person) {
  for (const name of names) {
    if (endsWith(name, removeHonorific(person))) {
      return true;
    }
  }
  return false;
}
