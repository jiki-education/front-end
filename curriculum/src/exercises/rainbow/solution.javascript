let x = 0;
let hue = 0;

for (let i = 0; i < 100; i++) {
  x = x + 1;
  hue = hue + 3;

  rectangle(x, 0, 1, 100, hslToHex(hue, 50, 50));
}
