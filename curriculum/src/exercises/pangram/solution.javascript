function contains(str, target) {
  for (const character of str) {
    if (target === character) {
      return true;
    }
  }
  return false;
}

function indexOf(sentence, target) {
  let idx = 0;
  for (const letter of sentence) {
    if (target === letter) {
      return idx;
    }
    idx = idx + 1;
  }
  return -1;
}

function toLower(sentence) {
  let output = "";
  let lower = "abcdefghijklmnopqrstuvwxyz";
  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let upperIdx = 0;
  for (const letter of sentence) {
    if (contains(lower, letter)) {
      output = output + letter;
    } else {
      upperIdx = indexOf(upper, letter);
      if (upperIdx !== -1) {
        output = output + lower[upperIdx];
      }
    }
  }
  return output;
}

function isPangram(sentence) {
  sentence = toLower(sentence);
  for (const letter of "abcdefghijklmnopqrstuvwxyz") {
    if (!contains(sentence, letter)) {
      return false;
    }
  }
  return true;
}
