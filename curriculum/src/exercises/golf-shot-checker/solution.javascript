let x = 29
let y = 75
let shotLength = getShotLength()

repeat(shotLength + 1) {
  x = x + 1
  rollTo(x, y)
}

if (shotLength >= 56 && shotLength <= 65) {
  repeat(9) {
    y = y + 1
    rollTo(x, y)
  }
}

fireFireworks()