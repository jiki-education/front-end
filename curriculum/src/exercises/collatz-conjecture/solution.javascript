function collatzSteps(number) {
  let idx = 0
  repeat() {
    if (number === 1) {
      return idx
    }

    if (number % 2 === 0) {
      number = number / 2
    } else {
      number = (number * 3) + 1
    }
    idx = idx + 1
  }
}
