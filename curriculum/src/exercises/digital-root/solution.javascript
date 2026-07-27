function digitalRoot(number) {
  while (number >= 10) {
    let sum = 0
    for (const char of String(number)) {
      sum = sum + Number(char)
    }
    number = sum
  }
  return number
}
