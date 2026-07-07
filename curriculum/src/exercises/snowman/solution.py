snowman_center_x = 50
head_center_y = 20
head_radius = 10
body_center_y = 40
body_radius = 15
base_center_y = 70
base_radius = 20

# Base (bottom, biggest)
circle(snowman_center_x, base_center_y, base_radius, "white")

# Body (middle)
circle(snowman_center_x, body_center_y, body_radius, "white")

# Head (top, smallest)
circle(snowman_center_x, head_center_y, head_radius, "white")
