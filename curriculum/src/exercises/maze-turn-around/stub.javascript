// TODO: Create a turnAround function here
// It should call turnLeft() twice

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
    // TODO: Use your turnAround function here
    turnLeft();
    turnLeft();
    move();
  }
}
