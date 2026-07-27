function isAlpha(string) {
  for (const char of string) {
    if (!"QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm".includes(char)) {
      return false
    }
  }
  return true
}

function isNumeric(string) {
  for (const char of string) {
    if (!"0123456789".includes(char)) {
      return false
    }
  }
  return true
}

function isAlphanumeric(string) {
  for (const char of string) {
    if (isAlpha(char)) {
      continue
    }
    if (isNumeric(char)) {
      continue
    }
    return false
  }
  return true
}

function whatAmI(string) {
  let alpha = isAlpha(string)
  let numeric = isNumeric(string)
  let alphanumeric = isAlphanumeric(string)

  if (alpha) {
    return "Alpha"
  } else if (numeric) {
    return "Numeric"
  } else if (alphanumeric) {
    return "Alphanumeric"
  } else {
    return "Unknown"
  }
}
