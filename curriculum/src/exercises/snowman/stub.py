# Fix these variables, then add the ones for the body and head
snowman_cx = 20
base_cy = 60
base_radius = 10

# Base (bottom, biggest)
circle(snowman_cx, base_cy, base_radius, "white")

# Body (middle)
circle(snowman_cx, body_cy, body_radius, "white")

# Head (top, smallest)
circle(snowman_cx, head_cy, head_radius, "white")
