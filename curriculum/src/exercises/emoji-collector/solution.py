def contains(haystack, needle):
    for thread in haystack:
        if needle == thread:
            return True
    return False

#--------------
#--------------
#--------------

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

def pick_up_emoji(emojis):
    reserved = ["⭐", "🏁", "⬜"]
    emoji = look("down")
    if contains(reserved, emoji):
        return emojis

    if emoji not in emojis:
        emojis[emoji] = 0

    emojis[emoji] = emojis[emoji] + 1
    remove_emoji()

    return emojis

#--------------
#--------------
#--------------

emojis = {}

repeat():
    turn_if_needed()
    move()
    emojis = pick_up_emoji(emojis)

announce_emojis(emojis)
