function findAnagrams(target, possibilities) {
  const lowerTarget = target.toLowerCase();
  const sortedTarget = lowerTarget.split('').sort().join('');
  const results = [];

  for (const candidate of possibilities) {
    const lowerCandidate = candidate.toLowerCase();

    // Skip if it's the same word (case-insensitive)
    if (lowerTarget === lowerCandidate) {
      continue;
    }

    // Check if it's an anagram by comparing sorted versions
    const sortedCandidate = lowerCandidate.split('').sort().join('');
    if (sortedTarget === sortedCandidate) {
      results.push(candidate);
    }
  }

  // Sort results alphabetically (case-insensitive)
  return results.sort((a, b) => {
    const lowerA = a.toLowerCase();
    const lowerB = b.toLowerCase();
    if (lowerA < lowerB) return -1;
    if (lowerA > lowerB) return 1;
    return 0;
  });
}
