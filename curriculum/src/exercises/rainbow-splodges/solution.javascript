let x = 0
let y = 0
let radius = 0
let hue = 0

repeat(200) {
  radius = Math.randomInt(2, 12)
  x = Math.randomInt(radius, 100 - radius)
  y = Math.randomInt(radius, 100 - radius)
  hue = Math.randomInt(0, 360)
  circle(x, y, radius, hsl(hue, 80, 50))
}
