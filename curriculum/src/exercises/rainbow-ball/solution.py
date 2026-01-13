# These variables expect to be incremented before
# they are used to draw the first circle
x = 3
y = 4
hue = 99

# These never need to change
saturation = 80
luminosity = 50

x_direction = 2
y_direction = 1
hue_direction = 1

for i in range(1000):
    x = x + x_direction
    y = y + y_direction
    hue = hue + hue_direction

    if x <= 0:
        x_direction = random_number(1, 5)
    if x >= 100:
        x_direction = random_number(-1, -5)

    if y <= 0:
        y_direction = random_number(1, 5)
    if y >= 100:
        y_direction = -random_number(1, 5)

    if hue_direction <= 0:
        hue_direction = 1
    if hue_direction >= 255:
        hue_direction = -1

    fill_color_hsl(hue, 80, 50)
    circle(x, y, 10)
