x = 0
y = 0
hue = 0

repeat(500):
    x = random.randint(0, 100)
    y = random.randint(0, 100)
    hue = random.randint(0, 360)
    circle(x, y, 3, hsl_to_hex(hue, 80, 50))
