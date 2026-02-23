# TODO: Create a turn_around function here
# It should call turn_left() twice

repeat():
    if can_turn_left():
        turn_left()
        move()
    elif can_move():
        move()
    elif can_turn_right():
        turn_right()
        move()
    else:
        # TODO: Use your turn_around function here
        turn_left()
        turn_left()
        move()
