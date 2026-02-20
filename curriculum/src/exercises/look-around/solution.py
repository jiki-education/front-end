def check_direction(direction):
    space = look(direction)
    return space != "fire" and space != "wall" and space != "poop"

def can_turn_left():
    return check_direction("left")

def can_turn_right():
    return check_direction("right")

def can_move():
    return check_direction("ahead")

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
