board_size = get_board_size()
margin = 2
canvas_size = 100
square_size = (canvas_size - 2 * margin) / board_size

border_color = "black"
dark_square_color = "dark brown"
light_square_color = "white"

piece_radius = square_size * 0.4
piece_inner_radius = square_size * 0.3
top_piece_color = "charcoal"
top_piece_rim_color = "black"
bottom_piece_color = "white"
bottom_piece_rim_color = "grey"

# Fill the whole canvas so the margin shows as a border around the board.
rectangle(0, 0, canvas_size, canvas_size, border_color)

row = 0
for i in range(board_size):
    col = 0
    for j in range(board_size):
        is_dark = (row + col) % 2 == 1

        square_x = margin + col * square_size
        square_y = margin + row * square_size

        square_color = light_square_color
        if is_dark:
            square_color = dark_square_color
        rectangle(square_x, square_y, square_size, square_size, square_color)

        if is_dark:
            center_x = square_x + square_size / 2
            center_y = square_y + square_size / 2

            if row < board_size / 2 - 1:
                circle(center_x, center_y, piece_radius, top_piece_rim_color)
                circle(center_x, center_y, piece_inner_radius, top_piece_color)
            elif row >= board_size / 2 + 1:
                circle(center_x, center_y, piece_radius, bottom_piece_rim_color)
                circle(center_x, center_y, piece_inner_radius, bottom_piece_color)

        col = col + 1
    row = row + 1
