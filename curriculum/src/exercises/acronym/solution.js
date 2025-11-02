function acronym(phrase) {
  let output = "";
  let wasSpace = true;

  for (const letter of phrase) {
    if (letter === " " || letter === "-") {
      wasSpace = true;
    } else if (wasSpace && /[a-zA-Z]/.test(letter)) {
      output = output + letter;
      wasSpace = false;
    }
  }

  return output.toUpperCase();
}
