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

def all_aliens_dead(aliens):
    for alien in aliens:
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