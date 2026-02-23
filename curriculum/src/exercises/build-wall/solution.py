height = 10
width = 20

col = -1
row = -1

num_iterations = 0

for i in range(10):
    row = row + 1
    if row % 2 == 0:
        col = -1
        num_iterations = 5
    else:
        col = -1.5
        num_iterations = 6

    for j in range(num_iterations):
        col = col + 1
        rectangle(col * width, row * height, width, height, "brick")
