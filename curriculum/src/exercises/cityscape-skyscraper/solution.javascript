let floors = numFloors() - 1
let y = 1

buildWall(1, y)
buildGlass(2, y)
buildEntrance(3, y)
buildGlass(4, y)
buildWall(5, y)

repeat(floors) {
  y = y + 1
  buildWall(1, y)
  buildGlass(2, y)
  buildGlass(3, y)
  buildGlass(4, y)
  buildWall(5, y)
}

y = y + 1
buildWall(1, y)
buildWall(2, y)
buildWall(3, y)
buildWall(4, y)
buildWall(5, y)
