function contains(haystack, needle) {
  for (const element of haystack) {
    if (element === needle) {
      return true;
    }
  }
  return false;
}