function acronym(phrase) {
  const words = split(phrase, " ");
  const letters = [];

  for (const word of words) {
    if (length(word) > 0) {
      const firstLetter = charAt(word, 0);
      const upperLetter = toUpperCase(firstLetter);
      letters.push(upperLetter);
    }
  }

  return join(letters, "");
}
