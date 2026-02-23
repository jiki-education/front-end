let buildings = numBuildings()
let x = 1

repeat(buildings) {
  let floors = Math.randomInt(0, 6)

  buildWall(x, 1)
  buildGlass(x + 1, 1)
  buildEntrance(x + 2, 1)
  buildGlass(x + 3, 1)
  buildWall(x + 4, 1)

  let y = 2
  repeat(floors) {
    buildWall(x, y)
    buildGlass(x + 1, y)
    buildGlass(x + 2, y)
    buildGlass(x + 3, y)
    buildWall(x + 4, y)
    y = y + 1
  }

  buildWall(x, y)
  buildWall(x + 1, y)
  buildWall(x + 2, y)
  buildWall(x + 3, y)
  buildWall(x + 4, y)

  x = x + 5
}
