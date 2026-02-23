function acronym(phrase) {
  let result = "";
  let isFirstLetter = true;

  for (const char of phrase) {
    if (char === " " || char === "-") {
      isFirstLetter = true;
    } else if (isFirstLetter) {
      result = result + char;
      isFirstLetter = false;
    }
  }

  return result.toUpperCase();
}
