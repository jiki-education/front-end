# Snowman (Arithmetic)

# These are fixed
head_radius = 5
snowman_x = 50
ground_y = 80

# Derive these from the variables above
body_radius = head_radius * 2
base_radius = head_radius * 3

base_y = ground_y - base_radius
body_y = base_y - base_radius - body_radius
head_y = body_y - body_radius - head_radius

# Base (bottom, biggest)
circle(snowman_x, base_y, base_radius, "white")

# Body (middle)
circle(snowman_x, body_y, body_radius, "white")

# Head (top, smallest)
circle(snowman_x, head_y, head_radius, "white")
