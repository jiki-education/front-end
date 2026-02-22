x = 0
hue = 0

for i in range(100):
    x = x + 1
    hue = hue + 3

    rectangle(x, 0, 1, 100, hsl(hue, 50, 50))
