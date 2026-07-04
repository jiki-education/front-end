let boardSize = getBoardSize()
let margin = 2
let canvasSize = 100
let squareSize = (canvasSize - 2 * margin) / boardSize

let borderColor = "black"
let darkSquareColor = "dark brown"
let lightSquareColor = "white"

let pieceRadius = squareSize * 0.4
let pieceInnerRadius = squareSize * 0.3
let topPieceColor = "charcoal"
let topPieceRimColor = "black"
let bottomPieceColor = "white"
let bottomPieceRimColor = "grey"

// Fill the whole canvas so the margin shows as a border around the board.
rectangle(0, 0, canvasSize, canvasSize, borderColor)

let row = 0
repeat(boardSize) {
  let col = 0
  repeat(boardSize) {
    let isDark = (row + col) % 2 === 1

    let squareX = margin + col * squareSize
    let squareY = margin + row * squareSize

    let squareColor = lightSquareColor
    if (isDark) {
      squareColor = darkSquareColor
    }
    rectangle(squareX, squareY, squareSize, squareSize, squareColor)

    if (isDark) {
      let centerX = squareX + squareSize / 2
      let centerY = squareY + squareSize / 2

      if (row < boardSize / 2 - 1) {
        circle(centerX, centerY, pieceRadius, topPieceRimColor)
        circle(centerX, centerY, pieceInnerRadius, topPieceColor)
      } else if (row >= boardSize / 2 + 1) {
        circle(centerX, centerY, pieceRadius, bottomPieceRimColor)
        circle(centerX, centerY, pieceInnerRadius, bottomPieceColor)
      }
    }

    col = col + 1
  }
  row = row + 1
}
