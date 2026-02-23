let leftBoundary = 0;
let rightBoundary = 10;
let direction = "right";
let position = 0;

function shootIfAlienAbove() {
  if (isAlienAbove()) {
    shoot();
  }
}

repeat() {
  shootIfAlienAbove();

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
