function layoutStars(numRows) {
  let result = []
  for (let i = numRows; i >= 1; i--) {
    let star = ""
    repeat(i) {
      star = star + "*"
    }
    result.push(star)
  }
  drawStars(result)
}