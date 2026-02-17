# Traffic Light

radius = 10
center_x = 50
top_y = 25
middle_y = 50
bottom_y = 75

# Background
rectangle(0, 0, 100, 100, "#333333")

# Traffic light housing
rectangle(30, 10, 40, 80, "#222222")

# Red light (top)
circle(center_x, top_y, radius, "#FF0000")

# Yellow light (middle)
circle(center_x, middle_y, radius, "#FFFF00")

# Green light (bottom)
circle(center_x, bottom_y, radius, "#00FF00")
