function appendRun(result, count, previous) {
  if (count > 1) {
    result = `${result}${count}`
  }
  return `${result}${previous}`
}

function encode(input) {
  let result = ""
  let previous = ""
  let count = 0

  for (const char of input) {
    if (char === previous) {
      count = count + 1
    } else {
      result = appendRun(result, count, previous)
      previous = char
      count = 1
    }
  }

  result = appendRun(result, count, previous)

  return result
}

function decode(input) {
  let result = ""
  let count = 0

  for (const char of input) {
    if ("0123456789".includes(char)) {
      count = count * 10 + Number(char)
    } else {
      if (count === 0) {
        count = 1
      }
      for (let i = 0; i < count; i++) {
        result = `${result}${char}`
      }
      count = 0
    }
  }

  return result
}
