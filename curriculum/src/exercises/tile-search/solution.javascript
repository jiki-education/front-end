function contains(haystack, needle) {
  for (const letter of haystack) {
    if (letter === needle) {
      return true
    }
  }
  return false
}