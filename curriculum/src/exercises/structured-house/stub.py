# Sky variables
sky_color = "#add8e6"
sky_left = 0
sky_top = 0
sky_width = 100
sky_height = 100

# House Frame variables
house_left = 20

# Roof variables
roof_overhang = 4
roof_left = house_left - roof_overhang

# The sky
rectangle(sky_left, sky_top, sky_width, sky_height, sky_color)

# The grass
rectangle(0, 80, 100, 100, "#3cb372")

# The frame of the house
rectangle(house_left, 50, 60, 40, "#f0985b")

# The roof
triangle(roof_left, 50, 50, 30, 84, 50, "#8b4513")

# The left window
rectangle(30, 55, 12, 13, "#FFFFFF")

# The second window
rectangle(58, 55, 12, 13, "#FFFFFF")

# The door
rectangle(43, 72, 14, 18, "#A0512D")

# The door knob
circle(55, 81, 1, "#FFDF00")
