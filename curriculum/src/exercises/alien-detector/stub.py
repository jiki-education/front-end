# Get the first row of aliens (the bottom one)
bottom_row = get_starting_aliens_in_row(1)

# Set variables about facts
left_boundary = 0
right_boundary = 10

# Set variables to track things
direction = "right"
position = 0

# Play the game
repeat():
    # TODO: is_alien_above() no longer exists...
    # How can you use the alien row data instead?
    # if is_alien_above():
    shoot()

    # If we hit an edge, change direction
    if position >= right_boundary:
        direction = "left"
    elif position <= left_boundary:
        direction = "right"

    # Move along
    if direction == "right":
        move_right()
        position = position + 1
    elif direction == "left":
        move_left()
        position = position - 1