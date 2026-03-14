bottom_row = get_starting_aliens_in_row(1)

left_boundary = 0
right_boundary = 10

direction = "right"
position = 0

repeat():
    # if is_alien_above():
    shoot()
    # pass

    if position >= right_boundary:
        direction = "left"
    elif position <= left_boundary:
        direction = "right"

    if direction == "right":
        move_right()
        position = position + 1
    elif direction == "left":
        move_left()
        position = position - 1
