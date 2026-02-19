let height = 10;
let width = 20;

let col = -1;
let row = -1;

let numIterations = 0;

repeat(10) {
  row = row + 1;
  if (row % 2 === 0) {
    col = -1;
    numIterations = 5;
  } else {
    col = -1.5;
    numIterations = 6;
  }

  repeat(numIterations) {
    col = col + 1;
    rectangle(col * width, row * height, width, height, "#AA4A44");
  }
}
