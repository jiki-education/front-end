x = 0
y = 0
radius = 0
hue = 0

repeat(200):
    radius = random.randint(2, 12)
    x = random.randint(radius, 100 - radius)
    y = random.randint(radius, 100 - radius)
    hue = random.randint(0, 360)
    circle(x, y, radius, hsl(hue, 80, 50))
