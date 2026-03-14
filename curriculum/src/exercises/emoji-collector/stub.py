def check_direction(direction):
    space = look(direction)
    return space != "🔥" and space != "🧱" and space != "💩"

def can_turn_left():
    return check_direction("left")
def can_turn_right():
    return check_direction("right")
def can_move():
    return check_direction("ahead")

def turn_around():
    turn_right()
    turn_right()

def turn_if_needed():
    if can_turn_left():
        turn_left()
    elif can_move():
        return
    elif can_turn_right():
        turn_right()
    else:
        turn_around()
