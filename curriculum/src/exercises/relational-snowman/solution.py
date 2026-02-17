# Snowman (Arithmetic)

# These are fixed
size = 5
snowman_x = 50
head_y = 20

# Derive these from the variables above
head_radius = size * 2
body_radius = size * 3
base_radius = size * 4

body_y = head_y + head_radius + body_radius
base_y = body_y + body_radius + base_radius

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
