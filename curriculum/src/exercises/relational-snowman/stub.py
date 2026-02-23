# Snowman (Arithmetic)
# Rewrite the snowman so all the sizes are based on head_radius.
# The circles should touch each other and stack from bottom to top.
# When you change head_radius, the whole snowman should scale!

# These are fixed
head_radius = 5
snowman_x = 50
ground_y = 80

# Derive these from the variables above
body_radius = 0
base_radius = 0

base_y = 0
body_y = 0
head_y = 0

# Base (bottom, biggest)
circle(snowman_x, base_y, base_radius, "white")

# Body (middle)
circle(snowman_x, body_y, body_radius, "white")

# Head (top, smallest)
circle(snowman_x, head_y, head_radius, "white")
