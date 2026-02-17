floors = num_floors() - 1
y = 1

build_wall(1, y)
build_glass(2, y)
build_entrance(3, y)
build_glass(4, y)
build_wall(5, y)

repeat(floors):
    y = y + 1
    build_wall(1, y)
    build_glass(2, y)
    build_glass(3, y)
    build_glass(4, y)
    build_wall(5, y)

y = y + 1
build_wall(1, y)
build_wall(2, y)
build_wall(3, y)
build_wall(4, y)
build_wall(5, y)
