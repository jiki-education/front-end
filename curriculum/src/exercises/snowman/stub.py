# Fix these variables, then add the ones for the body and head
snowman_center_x = 20
base_center_y = 60
base_radius = 10

# Base (bottom, biggest)
circle(snowman_center_x, base_center_y, base_radius, "white")

# Body (middle)
circle(snowman_center_x, body_center_y, body_radius, "white")

# Head (top, smallest)
circle(snowman_center_x, head_center_y, head_radius, "white")
