# Colors
sky_color = "skyblue"
grass_color = "green"
house_color = "brick"
roof_color = "brown"
window_color = "white"
door_color = "dark brown"
knob_color = "yellow"

# House frame
house_left = 20
house_top = 50
house_width = 60
house_height = 40

# Roof
roof_overhang = 4
roof_height = 20
roof_left = house_left - roof_overhang
roof_right = house_left + house_width + roof_overhang
roof_peak_x = house_left + house_width / 2
roof_peak_y = house_top - roof_height
roof_base_y = house_top

# Windows
window_width = 12
window_height = 13
window_inset = 10
window_top = house_top + 5
window1_left = house_left + window_inset
window2_left = house_left + house_width - window_inset - window_width

# Door
door_width = 14
door_height = 18
door_left = house_left + (house_width - door_width) / 2
door_top = house_top + house_height - door_height

# Door knob
knob_radius = 1
knob_x = door_left + door_width - knob_radius - 1
knob_y = door_top + door_height / 2

# Grass
grass_height = 20
grass_top = 100 - grass_height

# The sky
rectangle(0, 0, 100, 100, sky_color)

# The grass
rectangle(0, grass_top, 100, grass_height, grass_color)

# The frame of the house
rectangle(house_left, house_top, house_width, house_height, house_color)

# The roof
triangle(roof_left, roof_base_y, roof_peak_x, roof_peak_y, roof_right, roof_base_y, roof_color)

# The left window
rectangle(window1_left, window_top, window_width, window_height, window_color)

# The right window
rectangle(window2_left, window_top, window_width, window_height, window_color)

# The door
rectangle(door_left, door_top, door_width, door_height, door_color)

# The door knob
circle(knob_x, knob_y, knob_radius, knob_color)
