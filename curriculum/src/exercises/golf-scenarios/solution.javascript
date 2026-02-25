let x = 29
let shotLength = getShotLength()

repeat(shotLength + 1) {
  x = x + 1
  rollTo(x)
}

fireFireworks()