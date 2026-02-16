canvas_width = 100
ground_top = 90

flower_center_x = canvas_width / 2
flower_center_y = 90
flower_radius = 0

pistil_radius = 0

stem_top = 0
stem_height = 0
stem_width = 0
stem_left = 0

leaf_top = 0
leaf_x_radius = 0
leaf_y_radius = 0

left_leaf_left = 0
right_leaf_left = 0

for i in range(60):
    flower_center_y = flower_center_y - 1
    flower_radius = flower_radius + 0.4

    pistil_radius = pistil_radius + 0.1

    stem_top = flower_center_y
    stem_height = ground_top - flower_center_y
    stem_width = stem_height / 10
    stem_left = flower_center_x - (stem_width / 2)

    leaf_top = stem_top + (stem_height / 2)
    leaf_x_radius = flower_radius * 0.5
    leaf_y_radius = flower_radius * 0.2

    left_leaf_left = stem_left - leaf_x_radius
    right_leaf_left = stem_left + stem_width + leaf_x_radius

    # Sky
    rectangle(0, 0, 100, 90, "#ADD8E6")

    # Ground
    rectangle(0, ground_top, 100, 10, "green")

    # Stem
    rectangle(stem_left, stem_top, stem_width, stem_height, "green")

    # Flower head
    circle(flower_center_x, flower_center_y, flower_radius, "pink")

    # Pistil
    circle(flower_center_x, flower_center_y, pistil_radius, "yellow")

    # Leaves
    ellipse(left_leaf_left, leaf_top, leaf_x_radius, leaf_y_radius, "green")
    ellipse(right_leaf_left, leaf_top, leaf_x_radius, leaf_y_radius, "green")
