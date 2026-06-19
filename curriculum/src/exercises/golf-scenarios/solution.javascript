let x = 28
let shotLength = getShotLength()

repeat(shotLength) {
  x = x + 1
  rollTo(x)
}
