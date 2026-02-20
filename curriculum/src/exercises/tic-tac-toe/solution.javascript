function calculateNextMove(board, turn, permutations) {
  let move = calculateNextMoveWin(board, turn, permutations);
  if (move !== false) {
    return move;
  }

  move = calculateNextMoveBlock(board, turn, permutations);
  if (move !== false) {
    return move;
  }
  return calculateNextMoveValid(board);
}

function calculateNextMoveWin(board, turn, permutations) {
  for (const row of [1, 2, 3]) {
    for (const col of [1, 2, 3]) {
      if (board[row - 1][col - 1] === "") {
        board[row - 1][col - 1] = turn;
        for (const permutation of permutations) {
          if (hasWon(board, permutation, turn)) {
            board[row - 1][col - 1] = "";
            return [row, col];
          }
        }
        board[row - 1][col - 1] = "";
      }
    }
  }
  return false;
}

function calculateNextMoveBlock(board, turn, permutations) {
  turn = switchTurn(turn);
  return calculateNextMoveWin(board, turn, permutations);
}

function calculateNextMoveValid(board) {
  for (const row of [1, 2, 3]) {
    for (const col of [1, 2, 3]) {
      if (board[row - 1][col - 1] === "") {
        return [row, col];
      }
    }
  }
}

function drawGrid() {
  changeStroke(1, "#333333");
  rectangle(5, 5, 90, 90, "#ffffff");
  line(5, 35, 95, 35, "#000000");
  line(5, 65, 95, 65, "#000000");
  line(35, 5, 35, 95, "#000000");
  line(65, 5, 65, 95, "#000000");
}

function drawCross(row, col, color) {
  let cx = -10 + (col * 30);
  let cy = -10 + (row * 30);

  line(cx - 10, cy - 10, cx + 10, cy + 10, color);
  line(cx - 10, cy + 10, cx + 10, cy - 10, color);
}

function drawNaught(row, col, color) {
  circle(-10 + (col * 30), -10 + (row * 30), 10, color);
}

function drawPiece(turn, row, col, color) {
  if (turn === "x") {
    drawCross(row, col, color);
  } else {
    drawNaught(row, col, color);
  }
}

function hasWon(board, permutation, target) {
  let cell1 = board[permutation[0][0] - 1][permutation[0][1] - 1];
  let cell2 = board[permutation[1][0] - 1][permutation[1][1] - 1];
  let cell3 = board[permutation[2][0] - 1][permutation[2][1] - 1];
  return cell1 === target && cell1 === cell2 && cell2 === cell3;
}

function greyOut(board) {
  changeStroke(1, "#cccccc");

  for (const row of [1, 2, 3]) {
    for (const col of [1, 2, 3]) {
      if (board[row - 1][col - 1] !== "") {
        drawPiece(board[row - 1][col - 1], row, col, "#cccccc");
      }
    }
  }
}

function handleWin(board, permutation, winner) {
  greyOut(board);

  changeStroke(1.5, "#604fcd");
  for (const cell of permutation) {
    drawPiece(winner, cell[0], cell[1], "#604fcd");
  }

  rectangle(0, 0, 100, 100, "#604fcd");
  write("The " + winner + "'s won!");
}

function handleDraw(board) {
  greyOut(board);
  rectangle(0, 0, 100, 100, "#604fcd");
  write("The game was a draw!");
}

function guardMoveAllowed(board, row, col) {
  if (board[row - 1][col - 1] === "") {
    return true;
  }

  rectangle(0, 0, 100, 100, "#c80000");
  write("Invalid move!");

  return false;
}

function switchTurn(turn) {
  if (turn === "o") {
    return "x";
  } else {
    return "o";
  }
}

function runGame(moves) {
  let board = [["", "", ""], ["", "", ""], ["", "", ""]];
  let permutations = [
    [[1, 1], [1, 2], [1, 3]],
    [[2, 1], [2, 2], [2, 3]],
    [[3, 1], [3, 2], [3, 3]],
    [[1, 1], [2, 1], [3, 1]],
    [[1, 2], [2, 2], [3, 2]],
    [[1, 3], [2, 3], [3, 3]],
    [[1, 1], [2, 2], [3, 3]],
    [[1, 3], [2, 2], [3, 1]]
  ];
  drawGrid();

  let turn = "x";
  let row = 0;
  let col = 0;
  let numMoves = 0;

  for (let move of moves) {
    numMoves = numMoves + 1;
    turn = switchTurn(turn);

    if (move === "?") {
      move = calculateNextMove(board, turn, permutations);
    }

    row = move[0];
    col = move[1];

    if (!guardMoveAllowed(board, row, col)) {
      return;
    }

    board[row - 1][col - 1] = turn;
    drawPiece(turn, row, col, "#ffffff");

    for (const permutation of permutations) {
      if (hasWon(board, permutation, turn)) {
        handleWin(board, permutation, turn);
        return;
      }
    }

    if (numMoves === 9) {
      handleDraw(board);
      return;
    }
  }
}
