// These variables expect to be incremented before
// they are used to draw the first circle
let x = 3
let y = 4
let hue = 99

// These never need to change
let saturation = 80
let luminosity = 50

let xDirection = 2
let yDirection = 1
let hueDirection = 1

repeat(1000) {
  x = x + xDirection
  y = y + yDirection
  hue = hue + hueDirection

  if (x <= 0) {
    xDirection = Math.randomInt(1, 5)
  }
  if (x >= 100) {
    xDirection = Math.randomInt(-5, -1)
  }

  if (y <= 0) {
    yDirection = Math.randomInt(1, 5)
  }
  if (y >= 100) {
    yDirection = Math.randomInt(-5, -1)
  }

  if (hue <= 0) {
    hueDirection = 1
  }
  if (hue >= 360) {
    hueDirection = -1
  }

  circle(x, y, 10, hsl(hue, 80, 50))
}
