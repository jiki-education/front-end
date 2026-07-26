function digitalRoot(number) {
  while (number >= 10) {
    let sum = 0
    for (const char of `${number}`) {
      sum = sum + Number(char)
    }
    number = sum
  }
  return number
}
