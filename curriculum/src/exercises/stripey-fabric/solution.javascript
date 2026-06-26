let i = 1
let color = "white"
let left = 0
let width = 5

repeat(20) {
  if (i === 1 || i === 20) {
    color = "purple"
  } else if (i % 4 === 0) {
    color = "green"
  } else if (i % 2 === 0) {
    color = "blue"
  } else {
    color = "yellow"
  }
  left = (i - 1) * width
  rectangle(left, 0, width, 100, color)
  i = i + 1
}
