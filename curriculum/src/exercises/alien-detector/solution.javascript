function determineDirection(position, direction) {
  let leftBoundary = 0;
  let rightBoundary = 10;

  if (position >= rightBoundary) {
    return "left";
  } else if (position <= leftBoundary) {
    return "right";
  }
  return direction;
}

function move(position, direction) {
  if (direction === "right") {
    moveRight();
    position = position + 1;
  } else if (direction === "left") {
    moveLeft();
    position = position - 1;
  }
  return position;
}

function allAliensDead(row) {
  for (const alien of row) {
    if (alien) {
      return false;
    }
  }
  return true;
}

// Get the rows of aliens
let bottomRow = getStartingAliensInRow(1);
let middleRow = getStartingAliensInRow(2);
let topRow = getStartingAliensInRow(3);

// Set variables to track things
let direction = "right";
let position = 0;
let shot = false;

// Play the game
repeat() {
  shot = false;
  for (const row of [bottomRow, middleRow, topRow]) {
    if (shot === false && row[position]) {
      shoot();
      row[position] = false;
      shot = true;
    }
  }

  if (allAliensDead(bottomRow) && allAliensDead(middleRow) && allAliensDead(topRow)) {
    fireFireworks();
  } else {
    direction = determineDirection(position, direction);
    position = move(position, direction);
  }
}