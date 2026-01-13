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
fill_color_hex(sky_color)
rectangle(sky_left, sky_top, sky_width, sky_height)

# The grass
fill_color_hex("#3cb372")
rectangle(0, 80, 100, 100)

# The frame of the house
fill_color_hex("#f0985b")
rectangle(house_left, 50, 60, 40)

# The roof
fill_color_hex("#8b4513")
triangle(roof_left, 50, 50, 30, 84, 50)

# The left window
fill_color_hex("#FFFFFF")
rectangle(30, 55, 12, 13)

# The second window
fill_color_hex("#FFFFFF")
rectangle(58, 55, 12, 13)

# The door
fill_color_hex("#A0512D")
rectangle(43, 72, 14, 18)

# The door knob
fill_color_hex("#FFDF00")
circle(55, 81, 1)
