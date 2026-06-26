i = 1
color = "white"
left = 0
width = 5

for n in range(20):
    if i == 1 or i == 20:
        color = "purple"
    elif i % 4 == 0:
        color = "green"
    elif i % 2 == 0:
        color = "blue"
    else:
        color = "yellow"
    left = (i - 1) * width
    rectangle(left, 0, width, 100, color)
    i = i + 1
