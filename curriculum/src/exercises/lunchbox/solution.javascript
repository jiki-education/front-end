function packLunch(items, capacity) {
  let lunchbox = []
  let rucksack = []
  let total = 0
  for (const item of items.toReversed()) {
    const name = item[0]
    const size = item[1]
    if (total + size <= capacity) {
      lunchbox.push(name)
      total = total + size
    } else {
      rucksack.push(name)
    }
  }
  return [lunchbox, rucksack]
}
