// These variables expect to be incremented before
// they are used to draw the first circle
let x = 3;
let y = 4;
let hue = 99;

// These never need to change
let saturation = 80;
let luminosity = 50;

let xDirection = 2;
let yDirection = 1;
let hueDirection = 1;

for (let i = 0; i < 1000; i++) {
  x = x + xDirection;
  y = y + yDirection;
  hue = hue + hueDirection;

  if (x <= 0) {
    xDirection = randomNumber(1, 5);
  }
  if (x >= 100) {
    xDirection = randomNumber(-1, -5);
  }

  if (y <= 0) {
    yDirection = randomNumber(1, 5);
  }
  if (y >= 100) {
    yDirection = -randomNumber(1, 5);
  }

  if (hueDirection <= 0) {
    hueDirection = 1;
  }
  if (hueDirection >= 255) {
    hueDirection = -1;
  }

  fillColorHsl(hue, 80, 50);
  circle(x, y, 10);
}
