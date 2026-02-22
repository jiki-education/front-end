function collatzSteps(number) {
  let i = 0;
  repeat() {
    if (number === 1) {
      return i;
    }

    if (number % 2 === 0) {
      number = number / 2;
    } else {
      number = (number * 3) + 1;
    }
    i = i + 1;
  }
}
