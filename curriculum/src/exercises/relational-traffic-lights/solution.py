# Relational Traffic Lights
# Change the radius and watch the traffic light resize!

red = "#FF0000"
yellow = "#FFFF00"
green = "#00FF00"
housing_color = "#222222"

radius = 10
center_x = radius * 5
red_y = radius * 3
yellow_y = radius * 5
green_y = radius * 7
housing_x = radius * 3
housing_y = radius
housing_width = radius * 4
housing_height = radius * 8

# Traffic light housing
rectangle(housing_x, housing_y, housing_width, housing_height, housing_color)

# Red light (top)
circle(center_x, red_y, radius, red)

# Yellow light (middle)
circle(center_x, yellow_y, radius, yellow)

# Green light (bottom)
circle(center_x, green_y, radius, green)
