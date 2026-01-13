# Sky variables
sky_color = "#add8e6"
sky_left = 0
sky_top = 0
sky_width = 100
sky_height = 20

# Grass variables
grass_color = "#3cb372"
grass_left = 0
grass_top = 80
grass_width = 100
grass_height = 20

# House Frame variables
house_color = "#f0985b"
house_left = 20
house_top = 50
house_width = 60
house_height = 40

# Roof variables
roof_color = "#8b4513"
roof_overhang = 4
roof_left = house_left - roof_overhang
roof_right = house_left + house_width + roof_overhang
roof_peak_x = house_left + house_width / 2
roof_peak_y = house_top - 20
roof_base_y = house_top

# Left window variables
window_color = "#FFFFFF"
window1_left = 30
window1_top = 55
window_width = 12
window_height = 13

# Right window variables
window2_left = 58
window2_top = 55

# Door variables
door_color = "#A0512D"
door_left = 43
door_top = 72
door_width = 14
door_height = 18

# Door knob variables
knob_color = "#FFDF00"
knob_center_x = 55
knob_center_y = 81
knob_radius = 1

# The sky
fill_color_hex(sky_color)
rectangle(sky_left, sky_top, sky_width, sky_height)

# The grass
fill_color_hex(grass_color)
rectangle(grass_left, grass_top, grass_width, grass_height)

# The frame of the house
fill_color_hex(house_color)
rectangle(house_left, house_top, house_width, house_height)

# The roof
fill_color_hex(roof_color)
triangle(roof_left, roof_base_y, roof_peak_x, roof_peak_y, roof_right, roof_base_y)

# The left window
fill_color_hex(window_color)
rectangle(window1_left, window1_top, window_width, window_height)

# The second window
fill_color_hex(window_color)
rectangle(window2_left, window2_top, window_width, window_height)

# The door
fill_color_hex(door_color)
rectangle(door_left, door_top, door_width, door_height)

# The door knob
fill_color_hex(knob_color)
circle(knob_center_x, knob_center_y, knob_radius)
