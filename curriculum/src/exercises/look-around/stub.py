# Add your functions here

def turn_around():
    turn_right()
    turn_right()

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
        turn_around()
        move()
