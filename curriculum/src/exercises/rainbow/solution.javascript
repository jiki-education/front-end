let x = 0;
let hue = 0;

repeat(100) {
  let color = hsl(hue, 50, 50)
  rectangle(x, 0, 1, 100, color);

  x = x + 1;
  hue = hue + 3;
}
