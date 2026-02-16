shot_length = get_shot_length()

repeat(shot_length):
    move_ball_right()

if shot_length >= 56 and shot_length <= 63:
    repeat(9):
        move_ball_down()

    fire_fireworks()