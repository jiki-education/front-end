buildings = num_buildings()
x = 1

repeat(buildings):
    floors = random.randint(0, 6)

    build_wall(x, 1)
    build_glass(x + 1, 1)
    build_entrance(x + 2, 1)
    build_glass(x + 3, 1)
    build_wall(x + 4, 1)

    y = 2
    repeat(floors):
        build_wall(x, y)
        build_glass(x + 1, y)
        build_glass(x + 2, y)
        build_glass(x + 3, y)
        build_wall(x + 4, y)
        y = y + 1

    build_wall(x, y)
    build_wall(x + 1, y)
    build_wall(x + 2, y)
    build_wall(x + 3, y)
    build_wall(x + 4, y)

    x = x + 5
