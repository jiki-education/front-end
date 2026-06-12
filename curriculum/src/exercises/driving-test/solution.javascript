function didTheyPass(marks) {
  let minors = 0
  for (const mark of marks) {
    if (mark === "💥") {
      return false
    } else if (mark === "❌") {
      minors = minors + 1
    }
  }
  return minors < 5
}
