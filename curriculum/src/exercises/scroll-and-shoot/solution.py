left_boundary = 0
right_boundary = 10

direction = "right"
position = 0

repeat(1000):
    if is_alien_above():
        shoot()

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
