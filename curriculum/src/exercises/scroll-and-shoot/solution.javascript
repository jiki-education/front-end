let leftBoundary = 0;
let rightBoundary = 10;

let direction = "right";
let position = 0;

repeat() {
  if (isAlienAbove()) {
    shoot();
  }

  if (position >= rightBoundary) {
    direction = "left";
  } else if (position <= leftBoundary) {
    direction = "right";
  }

  if (direction === "right") {
    moveRight();
    position = position + 1;
  } else if (direction === "left") {
    moveLeft();
    position = position - 1;
  }
}
