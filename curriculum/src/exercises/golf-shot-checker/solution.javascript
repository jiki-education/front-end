let x = 28
let y = 75
let shotLength = getShotLength()

repeat(shotLength) {
  x = x + 1
  rollTo(x, y)
}

if (shotLength >= 58 && shotLength <= 62) {
  repeat(9) {
    y = y + 1
    rollTo(x, y)
  }
  fireFireworks()
}
