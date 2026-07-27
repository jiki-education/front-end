function valid(value) {
  let digits = ""
  for (const char of value) {
    if (char === " ") {
      continue
    }
    if (!"0123456789".includes(char)) {
      return false
    }
    digits = digits + char
  }

  if (digits.length <= 1) {
    return false
  }

  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[i])

    // Double every second digit, counting from the right.
    if ((digits.length - 1 - i) % 2 === 1) {
      digit = digit * 2
      if (digit > 9) {
        digit = digit - 9
      }
    }

    sum = sum + digit
  }

  return sum % 10 === 0
}
