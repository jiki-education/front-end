# Build a Snowman!

snowman_x = 50
head_y = 33
head_radius = 10
body_y = 50
body_radius = 15
base_y = 72
base_radius = 20

# Sky
rectangle(0, 0, 100, 60, "#87CEEB")

# Snowy ground
rectangle(0, 60, 100, 40, "#F0F0F0")

# Base (bottom, biggest)
circle(snowman_x, base_y, base_radius, "white")

# Body (middle)
circle(snowman_x, body_y, body_radius, "white")

# Head (top, smallest)
circle(snowman_x, head_y, head_radius, "white")
