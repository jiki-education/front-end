def draw_weather(elements):
    draw_sky()

    has_cloud = False
    for element in elements:
        if element == "cloud":
            has_cloud = True

    for element in elements:
        if element == "sun" and has_cloud:
            draw_sun("small")
        elif element == "sun":
            draw_sun("large")
        elif element == "cloud":
            draw_cloud()
        elif element == "rain":
            draw_rain()
        elif element == "snow":
            draw_snow()

def draw_sky():
    rectangle(0, 0, 100, 100, "#ADD8E6")

def draw_sun(size):
    if size == "large":
        circle(50, 50, 25, "#ffed06")
    else:
        circle(75, 30, 15, "#ffed06")

def draw_cloud():
    rectangle(25, 50, 50, 10, "#FFFFFF")
    circle(25, 50, 10, "#FFFFFF")
    circle(40, 40, 15, "#FFFFFF")
    circle(55, 40, 20, "#FFFFFF")
    circle(75, 50, 10, "#FFFFFF")

def draw_rain():
    ellipse(30, 70, 3, 5, "#56AEFF")
    ellipse(50, 70, 3, 5, "#56AEFF")
    ellipse(70, 70, 3, 5, "#56AEFF")
    ellipse(40, 80, 3, 5, "#56AEFF")
    ellipse(60, 80, 3, 5, "#56AEFF")

def draw_snow():
    circle(30, 70, 5, "#56AEFF")
    circle(50, 70, 5, "#56AEFF")
    circle(70, 70, 5, "#56AEFF")
    circle(40, 80, 5, "#56AEFF")
    circle(60, 80, 5, "#56AEFF")
