x = 0
hue = 0

for i in range(100):
    rectangle(x, 0, 1, 100, hsl(hue, 50, 50))

    x = x + 1
    hue = hue + 3
