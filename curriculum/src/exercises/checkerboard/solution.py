n = 8
margin = 2
cell = (100 - 2 * margin) / n

row = 0
for i in range(n):
    col = 0
    for j in range(n):
        is_dark = (row + col) % 2 == 1

        square_color = "white"
        if is_dark:
            square_color = "charcoal"
        rectangle(margin + col * cell, margin + row * cell, cell, cell, square_color)

        if is_dark:
            if row <= 2:
                circle(margin + col * cell + cell / 2, margin + row * cell + cell / 2, cell / 2 - 1, "red")
            elif row >= 5:
                circle(margin + col * cell + cell / 2, margin + row * cell + cell / 2, cell / 2 - 1, "skyblue")

        col = col + 1
    row = row + 1
