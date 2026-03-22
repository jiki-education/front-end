let floors = numFloors() - 1
let y = 2
let x = 19

buildWall(x - 2, y)
buildGlass(x - 1, y)
buildEntrance(x, y)
buildGlass(x + 1, y)
buildWall(x + 2, y)
y = y + 1

repeat(floors) {
  buildWall(x - 2, y)
  buildGlass(x - 1, y)
  buildGlass(x, y)
  buildGlass(x + 1, y)
  buildWall(x + 2, y)
  y = y + 1
}

buildWall(x - 2, y)
buildWall(x - 1, y)
buildWall(x, y)
buildWall(x + 1, y)
buildWall(x + 2, y)
