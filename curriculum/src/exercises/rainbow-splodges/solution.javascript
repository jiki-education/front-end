let x = 0
let y = 0
let hue = 0

repeat(500) {
  x = Math.randomInt(0, 100)
  y = Math.randomInt(0, 100)
  hue = Math.randomInt(0, 360)
  circle(x, y, 3, hsl(hue, 80, 50))
}
