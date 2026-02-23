// Get the first row of aliens (the bottom one)
let bottomRow = getStartingAliensInRow(1);

// Set variables about facts
let leftBoundary = 0;
let rightBoundary = 10;

// Set variables to track things
let direction = "right";
let position = 0;

// Play the game
repeat() {
  // TODO: isAlienAbove() no longer exists...
  // How can you use the alien row data instead?
  // if (isAlienAbove()) {
    shoot();
  // }

  // If we hit an edge, change direction
  if (position >= rightBoundary) {
    direction = "left";
  } else if (position <= leftBoundary) {
    direction = "right";
  }

  // Move along
  if (direction === "right") {
    moveRight();
    position = position + 1;
  } else if (direction === "left") {
    moveLeft();
    position = position - 1;
  }
}