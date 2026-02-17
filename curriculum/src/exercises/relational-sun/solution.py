# These are fixed
canvas_size = 100
gap = 10
sun_radius = 15
sky_color = "lightblue"
sun_color = "yellow"

# Derive these from the variables above
sun_x = canvas_size - gap - sun_radius
sun_y = gap + sun_radius

# Sky
rectangle(0, 0, canvas_size, canvas_size, sky_color)

# Sun
circle(sun_x, sun_y, sun_radius, sun_color)
