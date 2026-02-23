def calculate_next_move(board, turn, permutations):
    move = calculate_next_move_win(board, turn, permutations)
    if move != False:
        return move

    move = calculate_next_move_block(board, turn, permutations)
    if move != False:
        return move
    return calculate_next_move_valid(board)

def calculate_next_move_win(board, turn, permutations):
    for row in [1, 2, 3]:
        for col in [1, 2, 3]:
            if board[row - 1][col - 1] == "":
                board[row - 1][col - 1] = turn
                for permutation in permutations:
                    if has_won(board, permutation, turn):
                        board[row - 1][col - 1] = ""
                        return [row, col]
                board[row - 1][col - 1] = ""
    return False

def calculate_next_move_block(board, turn, permutations):
    turn = switch_turn(turn)
    return calculate_next_move_win(board, turn, permutations)

def calculate_next_move_valid(board):
    for row in [1, 2, 3]:
        for col in [1, 2, 3]:
            if board[row - 1][col - 1] == "":
                return [row, col]

def draw_grid():
    change_stroke(1, "#333333")
    rectangle(5, 5, 90, 90, "#ffffff")
    line(5, 35, 95, 35, "#000000")
    line(5, 65, 95, 65, "#000000")
    line(35, 5, 35, 95, "#000000")
    line(65, 5, 65, 95, "#000000")

def draw_cross(row, col, color):
    cx = -10 + (col * 30)
    cy = -10 + (row * 30)

    line(cx - 10, cy - 10, cx + 10, cy + 10, color)
    line(cx - 10, cy + 10, cx + 10, cy - 10, color)

def draw_naught(row, col, color):
    circle(-10 + (col * 30), -10 + (row * 30), 10, color)

def draw_piece(turn, row, col, color):
    if turn == "x":
        draw_cross(row, col, color)
    else:
        draw_naught(row, col, color)

def has_won(board, permutation, target):
    cell1 = board[permutation[0][0] - 1][permutation[0][1] - 1]
    cell2 = board[permutation[1][0] - 1][permutation[1][1] - 1]
    cell3 = board[permutation[2][0] - 1][permutation[2][1] - 1]
    return cell1 == target and cell1 == cell2 and cell2 == cell3

def grey_out(board):
    change_stroke(1, "#cccccc")

    for row in [1, 2, 3]:
        for col in [1, 2, 3]:
            if board[row - 1][col - 1] != "":
                draw_piece(board[row - 1][col - 1], row, col, "#cccccc")

def handle_win(board, permutation, winner):
    grey_out(board)

    change_stroke(1.5, "#604fcd")
    for cell in permutation:
        draw_piece(winner, cell[0], cell[1], "#604fcd")

    rectangle(0, 0, 100, 100, "#604fcd")
    write("The " + winner + "'s won!")

def handle_draw(board):
    grey_out(board)
    rectangle(0, 0, 100, 100, "#604fcd")
    write("The game was a draw!")

def guard_move_allowed(board, row, col):
    if board[row - 1][col - 1] == "":
        return True

    rectangle(0, 0, 100, 100, "#c80000")
    write("Invalid move!")

    return False

def switch_turn(turn):
    if turn == "o":
        return "x"
    else:
        return "o"

def run_game(moves):
    board = [["", "", ""], ["", "", ""], ["", "", ""]]
    permutations = [
        [[1, 1], [1, 2], [1, 3]],
        [[2, 1], [2, 2], [2, 3]],
        [[3, 1], [3, 2], [3, 3]],
        [[1, 1], [2, 1], [3, 1]],
        [[1, 2], [2, 2], [3, 2]],
        [[1, 3], [2, 3], [3, 3]],
        [[1, 1], [2, 2], [3, 3]],
        [[1, 3], [2, 2], [3, 1]]
    ]
    draw_grid()

    turn = "x"
    row = 0
    col = 0
    num_moves = 0

    for move in moves:
        num_moves = num_moves + 1
        turn = switch_turn(turn)

        if move == "?":
            move = calculate_next_move(board, turn, permutations)

        row = move[0]
        col = move[1]

        if not guard_move_allowed(board, row, col):
            return

        board[row - 1][col - 1] = turn
        draw_piece(turn, row, col, "#ffffff")

        for permutation in permutations:
            if has_won(board, permutation, turn):
                handle_win(board, permutation, turn)
                return

        if num_moves == 9:
            handle_draw(board)
            return
