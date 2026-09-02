let poem = ""
let words = 0
let needsSpace = false

while (true) {
  let found = move()

  if (found === "🏁" || words >= 7) {
    break
  }
  if (found === "" || isEmoji(found)) {
    continue
  }
  if (found === ",") {
    poem = poem + ","
    continue
  }
  if (found === "'") {
    poem = poem + "'"
    needsSpace = false
    continue
  }
  if (needsSpace) {
    poem = poem + " "
  }
  poem = poem + found
  needsSpace = true
  words = words + 1
}

recite(poem)
