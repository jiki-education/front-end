buildings = num_buildings()
x = 2

repeat(buildings):
    width = random_width()
    floors = random_num_floors()
    entranceOffset = (width - 1) // 2

    build_wall(x, 2)
    col = x + 1
    repeat(entranceOffset - 1):
        build_glass(col, 2)
        col = col + 1
    build_entrance(col, 2)
    col = col + 1
    repeat(entranceOffset - 1):
        build_glass(col, 2)
        col = col + 1
    build_wall(x + width - 1, 2)

    y = 3
    repeat(floors):
        build_wall(x, y)
        col = x + 1
        repeat(width - 2):
            build_glass(col, y)
            col = col + 1
        build_wall(x + width - 1, y)
        y = y + 1

    col = x
    repeat(width):
        build_wall(col, y)
        col = col + 1

    x = x + width + 1
