x = 29
y = 75
shot_length = get_shot_length()

repeat(shot_length + 1):
    x = x + 1
    roll_to(x, y)

if shot_length >= 56 and shot_length <= 65:
    repeat(9):
        y = y + 1
        roll_to(x, y)

fire_fireworks()