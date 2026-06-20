# Colors
sky_color = "skyblue"
grass_color = "green"
house_color = "brown"
roof_color = "brick"
window_color = "white"
door_color = "dark brown"
knob_color = "yellow"

# Canvas
canvas_width = 100

# House frame
house_width = 60
house_height = 40

# Center and position the frame
center_x = canvas_width / 2
house_left = center_x - house_width / 2

# Grass
grass_height = 15
grass_top = 100 - grass_height

# The house sits 5 below the top of the grass, and grows upward from there
house_bottom = grass_top + 5
house_top = house_bottom - house_height

# Roof
roof_overhang = house_width / 10
roof_height = house_height / 2
roof_left = house_left - roof_overhang
roof_right = house_left + house_width + roof_overhang
roof_peak_x = center_x
roof_peak_y = house_top - roof_height
roof_base_y = house_top

# Windows
window_width = house_width / 5
window_height = house_height / 3
window_inset = house_width / 7
window_top = house_top + house_height / 8
window1_left = house_left + window_inset
window2_left = house_left + house_width - window_inset - window_width

# Door
door_width = house_width / 5
door_height = house_height / 2
door_left = center_x - door_width / 2
door_top = house_bottom - door_height

# Door knob
knob_radius = door_width / 10
knob_offset = door_width / 10
knob_x = door_left + door_width - knob_radius - knob_offset
knob_y = door_top + door_height / 2

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
