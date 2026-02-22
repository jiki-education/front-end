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
    turnLeft();
    turnLeft();
    move();
  }
}
