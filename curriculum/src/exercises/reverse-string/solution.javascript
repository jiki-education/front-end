function reverse(str) {
  let result = "";
  for (const letter of str) {
    result = letter + result;
  }
  return result;
}
