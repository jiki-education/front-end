let x = 0;
let hue = 0;

repeat(100) {
  x = x + 1;
  hue = hue + 3;

  rectangle(x, 0, 1, 100, hslToHex(hue, 50, 50));
}
