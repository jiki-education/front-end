snowman_cx = 50
head_cy = 20
head_radius = 10
body_cy = 40
body_radius = 15
base_cy = 70
base_radius = 20

# Base (bottom, biggest)
circle(snowman_cx, base_cy, base_radius, "white")

# Body (middle)
circle(snowman_cx, body_cy, body_radius, "white")

# Head (top, smallest)
circle(snowman_cx, head_cy, head_radius, "white")
