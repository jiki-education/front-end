sun_radius = 5
sun_cy = 10

sun_red = 255
sun_green = 237
sun_blue = 0

sky_h = 210
sky_s = 70
sky_l = 60

for i in range(100):
    # The sky
    sky_h = sky_h + 0.4
    fill_color_hsl(sky_h, sky_s, sky_l)
    rectangle(0, 0, 100, 100)

    # The Sun
    sun_green = sun_green - 1
    sun_cy = sun_cy + 1
    sun_radius = sun_radius + 0.2
    fill_color_rgb(sun_red, sun_green, sun_blue)
    circle(50, sun_cy, sun_radius)

    # The sea
    fill_color_hex("#0308ce")
    rectangle(0, 85, 100, 5)

    # The sand
    fill_color_hex("#C2B280")
    rectangle(0, 90, 100, 10)
