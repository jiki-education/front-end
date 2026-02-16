let shotLength = getShotLength();

repeat(shotLength) {
  moveBallRight();
}

if (shotLength >= 56 && shotLength <= 63) {
  repeat(9) {
    moveBallDown();
  }

  fireFireworks();
}