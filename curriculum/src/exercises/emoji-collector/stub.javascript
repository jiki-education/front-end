function checkDirection(direction) {
  let space = look(direction);
  return space !== "🔥" && space !== "🧱" && space !== "💩";
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

function turnIfNeeded() {
  if (canTurnLeft()) {
    turnLeft();
  } else if (canMove()) {
    return;
  } else if (canTurnRight()) {
    turnRight();
  } else {
    turnAround();
  }
}
