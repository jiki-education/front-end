# Relational Traffic Lights
# You're back with the traffic lights!
# This time, change the radius and watch the traffic light resize!

# These are set for you
red = "#FF0000"
yellow = "#FFFF00"
green = "#00FF00"
housing_color = "#222222"
radius = 10

# Fix these so they are all relative to the radius
center_x = 0
red_y = 0
yellow_y = 0
green_y = 0
housing_x = 0
housing_y = 0
housing_width = 0
housing_height = 0

# Traffic light housing
rectangle(housing_x, housing_y, housing_width, housing_height, housing_color)

# Red light (top)
circle(center_x, red_y, radius, red)

# Yellow light (middle)
circle(center_x, yellow_y, radius, yellow)

# Green light (bottom)
circle(center_x, green_y, radius, green)
