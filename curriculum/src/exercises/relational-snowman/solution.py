snowman_x = 50
size = 1

# Derive radii from size
head_radius = size * 2
body_radius = size * 3
base_radius = size * 4

# Derive the y positions so the circles touch, starting from the ground
base_y = 100 - size - base_radius
body_y = base_y - base_radius - body_radius
head_y = body_y - body_radius - head_radius

# Head (top, smallest)
circle(snowman_x, head_y, head_radius, "white")

# Body (middle)
circle(snowman_x, body_y, body_radius, "white")

# Base (bottom, biggest)
circle(snowman_x, base_y, base_radius, "white")
