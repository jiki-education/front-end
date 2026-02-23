function includes(str, target) {
  for (const character of str) {
    if (target === character) {
      return true;
    }
  }
  return false;
}

function isPangram(sentence) {
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!includes(sentence, letter)) {
      return false;
    }
  }
  return true;
}
