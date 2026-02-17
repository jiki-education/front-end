# Build a Snowman!
# Set the variables so the snowman matches the image

snowman_x = 0
head_y = 0
head_size = 0
body_y = 0
body_size = 0
base_y = 0
base_size = 0

# Sky
rectangle(0, 0, 100, 60, "#87CEEB")

# Snowy ground
rectangle(0, 60, 100, 40, "#F0F0F0")

# Base (bottom, biggest)
circle(snowman_x, base_y, base_size, "white")

# Body (middle)
circle(snowman_x, body_y, body_size, "white")

# Head (top, smallest)
circle(snowman_x, head_y, head_size, "white")
