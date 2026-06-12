snowman_x = 50
size = 4

head_radius = 0
body_radius = 0
base_radius = 0

base_y = 0
body_y = 0
head_y = 0

# Head (top, smallest)
circle(snowman_x, head_y, head_radius, "white")

# Body (middle)
circle(snowman_x, body_y, body_radius, "white")

# Base (bottom, biggest)
circle(snowman_x, base_y, base_radius, "white")
