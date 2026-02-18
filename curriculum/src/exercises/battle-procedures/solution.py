left_boundary = 0
right_boundary = 10
direction = "right"
position = 0

def shoot_if_alien_above():
    if is_alien_above():
        shoot()

repeat():
    shoot_if_alien_above()

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
