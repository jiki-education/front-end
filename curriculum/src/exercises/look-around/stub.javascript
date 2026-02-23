// Add your checkDirection, canTurnLeft, canTurnRight, and canMove functions here

function turnAround() {
  turnRight();
  turnRight();
}

repeat() {
  if (canTurnLeft()) {
    turnLeft();
    move();
  } else if (canMove()) {
    move();
  } else if (canTurnRight()) {
    turnRight();
    move();
  } else {
    turnAround();
  }
}
