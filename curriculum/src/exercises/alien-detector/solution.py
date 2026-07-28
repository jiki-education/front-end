def determine_direction(pos, dir):
    left_boundary = 0
    right_boundary = 10

    if pos >= right_boundary:
        return "left"
    elif pos <= left_boundary:
        return "right"
    return dir

def move(pos, dir):
    if dir == "right":
        move_right()
        pos = pos + 1
    elif dir == "left":
        move_left()
        pos = pos - 1
    return pos

# Get the rows of aliens
bottom_row = get_starting_aliens_in_row(0)
middle_row = get_starting_aliens_in_row(1)
top_row = get_starting_aliens_in_row(2)

# Set variables to track things
direction = "right"
position = 0
shot = False

# Play the game
repeat():
    shot = False
    for row in [bottom_row, middle_row, top_row]:
        if not shot and row[position]:
            shoot()
            row[position] = False
            shot = True

    direction = determine_direction(position, direction)
    position = move(position, direction)
