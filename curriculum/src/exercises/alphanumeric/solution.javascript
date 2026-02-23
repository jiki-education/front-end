function contains(haystack, needle) {
  for (const element of haystack) {
    if (element === needle) {
      return true;
    }
  }
  return false;
}

function isAlpha(string) {
  for (const char of string) {
    if (!contains("QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm", char)) {
      return false;
    }
  }
  return true;
}

function isNumeric(string) {
  for (const char of string) {
    if (!contains("0123456789", char)) {
      return false;
    }
  }
  return true;
}

function isAlphanumeric(string) {
  for (const char of string) {
    if (isAlpha(char)) {
      continue;
    }
    if (isNumeric(char)) {
      continue;
    }
    return false;
  }
  return true;
}

function whatAmI(string) {
  let alpha = isAlpha(string);
  let numeric = isNumeric(string);
  let alphanumeric = isAlphanumeric(string);

  if (alpha) {
    return "Alpha";
  } else if (numeric) {
    return "Numeric";
  } else if (alphanumeric) {
    return "Alphanumeric";
  } else {
    return "Unknown";
  }
}
