function findAnagrams(target, possibilities) {
  const targetLower = target.toLowerCase();
  const sortedTarget = targetLower.split("").sort().join("");
  const results = [];

  for (const word of possibilities) {
    const wordLower = word.toLowerCase();
    if (targetLower !== wordLower) {
      const sortedWord = wordLower.split("").sort().join("");
      if (sortedTarget === sortedWord) {
        results.push(word);
      }
    }
  }

  return results;
}
