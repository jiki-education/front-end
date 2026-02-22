function length(str) {
  let counter = 0;
  for (const char of str) {
    counter = counter + 1;
  }
  return counter;
}

function startsWith(str, substr) {
  if (length(str) < length(substr)) {
    return false;
  }

  let counter = 0;
  for (const char of substr) {
    if (str[counter] !== char) {
      return false;
    }
    counter = counter + 1;
  }

  return true;
}

function endsWith(word, substr) {
  let wordLength = length(word);
  let substrLength = length(substr);
  if (substrLength > wordLength) {
    return false;
  }

  let counter = wordLength - substrLength;
  for (const letter of substr) {
    if (letter !== word[counter]) {
      return false;
    }
    counter = counter + 1;
  }

  return true;
}

function stripPrefix(description, numLetters) {
  let res = "";
  let counter = numLetters;
  let descLength = length(description);
  repeat(descLength - numLetters) {
    res = res + description[counter];
    counter = counter + 1;
  }
  return res;
}

function removeLeftRight(description) {
  if (startsWith(description, "left ")) {
    return stripPrefix(description, 5);
  } else {
    return stripPrefix(description, 6);
  }
}

function switchLeftRight(description) {
  if (startsWith(description, "left ")) {
    return "right " + removeLeftRight(description);
  } else if (startsWith(description, "right ")) {
    return "left " + removeLeftRight(description);
  }
  return description;
}

function extractSocks(list) {
  let socks = [];
  for (const item of list) {
    if (endsWith(item, " sock")) {
      socks.push(item);
    }
  }
  return socks;
}

function pushIfMissing(list, element) {
  for (const item of list) {
    if (item === element) {
      return list;
    }
  }
  list.push(element);
  return list;
}

function matchingSocks(clean, dirty) {
  let cleanSocks = extractSocks(clean);
  let dirtySocks = extractSocks(dirty);
  let socks = cleanSocks.concat(dirtySocks);
  let matchingSocksList = [];

  let otherSock = "";
  for (const sock1 of socks) {
    otherSock = switchLeftRight(sock1);

    for (const sock2 of socks) {
      if (otherSock === sock2) {
        matchingSocksList = pushIfMissing(matchingSocksList, removeLeftRight(otherSock) + "s");
      }
    }
  }
  return matchingSocksList;
}
