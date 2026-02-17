# Build a Snowman!

snowman_x = 50
head_y = 27
head_size = 5
body_y = 42
body_size = 10
base_y = 72
base_size = 20

# Sky
rectangle(0, 0, 100, 60, "#87CEEB")

# Snowy ground
rectangle(0, 60, 100, 40, "#F0F0F0")

# Base (bottom, biggest)
circle(snowman_x, base_y, base_size, "white")

# Body (middle)
circle(snowman_x, body_y, body_size, "white")

# Head (top, smallest)
circle(snowman_x, head_y, head_size, "white")
