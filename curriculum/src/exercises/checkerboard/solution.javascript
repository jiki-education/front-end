let n = 8
let margin = 2
let cell = (100 - 2 * margin) / n

let row = 0
repeat(n) {
  let col = 0
  repeat(n) {
    let isDark = (row + col) % 2 === 1

    let squareColor = "white"
    if (isDark) {
      squareColor = "charcoal"
    }
    rectangle(margin + col * cell, margin + row * cell, cell, cell, squareColor)

    if (isDark) {
      if (row <= 2) {
        circle(margin + col * cell + cell / 2, margin + row * cell + cell / 2, cell / 2 - 1, "red")
      } else if (row >= 5) {
        circle(margin + col * cell + cell / 2, margin + row * cell + cell / 2, cell / 2 - 1, "skyblue")
      }
    }

    col = col + 1
  }
  row = row + 1
}
