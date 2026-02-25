x = 29
shot_length = get_shot_length()

repeat(shot_length + 1):
    x = x + 1
    roll_to(x)

fire_fireworks()