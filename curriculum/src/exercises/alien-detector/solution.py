def determine_direction(position, direction):
    left_boundary = 0
    right_boundary = 10

    if position >= right_boundary:
        return "left"
    elif position <= left_boundary:
        return "right"
    return direction

def move(position, direction):
    if direction == "right":
        move_right()
        position = position + 1
    elif direction == "left":
        move_left()
        position = position - 1
    return position

def all_aliens_dead(row):
    for alien in row:
        if alien:
            return False
    return True

# Get the rows of aliens
bottom_row = get_starting_aliens_in_row(1)
middle_row = get_starting_aliens_in_row(2)
top_row = get_starting_aliens_in_row(3)

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

    if all_aliens_dead(bottom_row) and all_aliens_dead(middle_row) and all_aliens_dead(top_row):
        fire_fireworks()
    else:
        direction = determine_direction(position, direction)
        position = move(position, direction)