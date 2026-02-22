# Build a Snowman!
# Set the variables so the snowman matches the image

snowman_x = 0
head_y = 0
head_radius = 0
body_y = 0
body_radius = 0
base_y = 0
base_radius = 0

# Sky
rectangle(0, 0, 100, 60, "skyblue")

# Snowy ground
rectangle(0, 60, 100, 40, "grey")

# Base (bottom, biggest)
circle(snowman_x, base_y, base_radius, "white")

# Body (middle)
circle(snowman_x, body_y, body_radius, "white")

# Head (top, smallest)
circle(snowman_x, head_y, head_radius, "white")
