x = 28
y = 75
shot_length = get_shot_length()

repeat(shot_length):
    x = x + 1
    move_to(x, y)

if shot_length >= 58 and shot_length <= 62:
    repeat(9):
        y = y + 1
        move_to(x, y)
    fire_fireworks()
