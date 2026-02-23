function isValidIsbn(isbn) {
  let total = 0;
  let num = 0;
  let multiplier = 10;

  for (const char of isbn) {
    if (char === "X" && multiplier === 1) {
      num = 10;
    } else if (char === "-") {
      continue;
    } else if ("0123456789".includes(char)) {
      num = Number(char);
    } else {
      return false;
    }

    total = total + (num * multiplier);
    multiplier = multiplier - 1;
  }

  if (multiplier !== 0) {
    return false;
  }

  return total % 11 === 0;
}