# Step 1: Define your fact variables
canvas_size = 100
gap = 10
radius = 15
color = "yellow"

# Step 2: Define calculated variables
sun_x = canvas_size - gap - radius
sun_y = gap + radius

# Step 3: Draw the circle
circle(sun_x, sun_y, radius, color)
