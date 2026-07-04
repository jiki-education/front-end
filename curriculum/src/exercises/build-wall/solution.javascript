let height = 10
let width = 20

let col = 0
let y = 100

let rowIndex = -1
let numIterations = 0

repeat(10) {
  y = y - height
  rowIndex = rowIndex + 1
  if (rowIndex % 2 === 0) {
    col = 0
    numIterations = 5
  } else {
    col = -0.5
    numIterations = 6
  }

  repeat(numIterations) {
    rectangle(col * width, y, width, height, "brick")
    col = col + 1
  }
}
