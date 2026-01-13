let height = 10;
let width = 20;

let col = -1;
let row = -1;

let numIterations = 0;
fillColorHex("#AA4A44");

for (let r = 0; r < 10; r++) {
  row = row + 1;
  if (row % 2 == 0) {
    col = -1;
    numIterations = 5;
  } else {
    col = -1.5;
    numIterations = 6;
  }

  for (let c = 0; c < numIterations; c++) {
    col = col + 1;
    rectangle(col * width, row * height, width, height);
  }
}
