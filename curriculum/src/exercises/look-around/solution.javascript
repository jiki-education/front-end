function checkDirection(direction) {
  let space = look(direction);
  return space !== "fire" && space !== "wall" && space !== "poop";
}

function canTurnLeft() {
  return checkDirection("left");
}
function canTurnRight() {
  return checkDirection("right");
}
function canMove() {
  return checkDirection("ahead");
}

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
