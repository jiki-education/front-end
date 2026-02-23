function contains(haystack, needle) {
  for (const thread of haystack) {
    if (needle === thread) {
      return true;
    }
  }
  return false;
}

//--------------
//--------------
//--------------

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

function pickUpEmoji(collection) {
  let reserved = ["⭐", "🏁", "⬜"];
  let emoji = look("down");
  if (contains(reserved, emoji)) {
    return collection;
  }

  if (!(emoji in collection)) {
    collection[emoji] = 0;
  }

  collection[emoji] = collection[emoji] + 1;
  removeEmoji();

  return collection;
}

//--------------
//--------------
//--------------

let emojis = {};

repeat() {
  turnIfNeeded();
  move();
  emojis = pickUpEmoji(emojis);
}

announceEmojis(emojis);
