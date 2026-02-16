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
    rectangle(0, 0, 100, 100, hsl_to_hex(sky_h, sky_s, sky_l))

    # The Sun
    sun_green = sun_green - 1
    sun_cy = sun_cy + 1
    sun_radius = sun_radius + 0.2
    circle(50, sun_cy, sun_radius, rgb_to_hex(sun_red, sun_green, sun_blue))

    # The sea
    rectangle(0, 85, 100, 5, "#0308ce")

    # The sand
    rectangle(0, 90, 100, 10, "#C2B280")
