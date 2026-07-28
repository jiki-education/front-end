function determineDirection(pos, dir) {
  let leftBoundary = 0
  let rightBoundary = 10

  if (pos >= rightBoundary) {
    return "left"
  } else if (pos <= leftBoundary) {
    return "right"
  }
  return dir
}

function move(pos, dir) {
  if (dir === "right") {
    moveRight()
    pos = pos + 1
  } else if (dir === "left") {
    moveLeft()
    pos = pos - 1
  }
  return pos
}

// Get the rows of aliens
let bottomRow = getStartingAliensInRow(0)
let middleRow = getStartingAliensInRow(1)
let topRow = getStartingAliensInRow(2)

// Set variables to track things
let direction = "right"
let position = 0
let shot = false

// Play the game
repeat() {
  shot = false
  for (const row of [bottomRow, middleRow, topRow]) {
    if (shot === false && row[position]) {
      shoot()
      row[position] = false
      shot = true
    }
  }

  direction = determineDirection(position, direction)
  position = move(position, direction)
}
