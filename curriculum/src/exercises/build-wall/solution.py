height = 10
width = 20

col = 0
y = 100

row_index = -1
num_iterations = 0

for i in range(10):
    y = y - height
    row_index = row_index + 1
    if row_index % 2 == 0:
        col = 0
        num_iterations = 5
    else:
        col = -0.5
        num_iterations = 6

    for j in range(num_iterations):
        rectangle(col * width, y, width, height, "brick")
        col = col + 1
