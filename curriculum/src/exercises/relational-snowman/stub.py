# Snowman (Arithmetic)
# Rewrite the snowman so all the sizes are based on one variable.
# The circles should touch each other and stack from top to bottom.
# When you change size, the whole snowman should scale!

# These are fixed
size = 5
snowman_x = 50
head_y = 20

# Derive these from the variables above
head_radius = 0
body_radius = 0
base_radius = 0

body_y = 0
base_y = 0

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
