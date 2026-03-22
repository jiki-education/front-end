let buildings = numBuildings()
let x = 2

repeat(buildings) {
  let width = randomWidth()
  let floors = randomNumFloors()
  let entranceOffset = (width - 1) / 2

  buildWall(x, 2)
  let col = x + 1
  repeat(entranceOffset - 1) {
    buildGlass(col, 2)
    col = col + 1
  }
  buildEntrance(col, 2)
  col = col + 1
  repeat(entranceOffset - 1) {
    buildGlass(col, 2)
    col = col + 1
  }
  buildWall(x + width - 1, 2)

  let y = 3
  repeat(floors) {
    buildWall(x, y)
    col = x + 1
    repeat(width - 2) {
      buildGlass(col, y)
      col = col + 1
    }
    buildWall(x + width - 1, y)
    y = y + 1
  }

  col = x
  repeat(width) {
    buildWall(col, y)
    col = col + 1
  }

  x = x + width + 1
}
