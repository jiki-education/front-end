floors = num_floors() - 1
y = 2
x = 19

build_wall(x - 2, y)
build_glass(x - 1, y)
build_entrance(x, y)
build_glass(x + 1, y)
build_wall(x + 2, y)
y = y + 1

repeat(floors):
    build_wall(x - 2, y)
    build_glass(x - 1, y)
    build_glass(x, y)
    build_glass(x + 1, y)
    build_wall(x + 2, y)
    y = y + 1

build_wall(x - 2, y)
build_wall(x - 1, y)
build_wall(x, y)
build_wall(x + 1, y)
build_wall(x + 2, y)
