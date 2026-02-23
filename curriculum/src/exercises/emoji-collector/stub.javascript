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

// Your code here
// 1. Create a pickUpEmoji function that checks the current square
//    and collects any non-special emojis into an object
// 2. Navigate the maze, collecting emojis as you go
// 3. After reaching the finish, call announceEmojis with your object
