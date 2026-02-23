function getLength(word) {
  let counter = 0;
  for (const letter of word) {
    counter = counter + 1;
  }
  return counter;
}

function startsWith(phase, prefix) {
  if (getLength(prefix) > getLength(phase)) {
    return false;
  }

  let i = 0;
  repeat(getLength(prefix)) {
    if (prefix[i] !== phase[i]) {
      return false;
    }
    i = i + 1;
  }
  return true;
}

let name = askName();
let allowedStart = getAllowedStart();

if (startsWith(name, allowedStart)) {
  letIn();
} else {
  turnAway();
}
