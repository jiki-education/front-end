let count = numFlowers()
let gap = 100 / (count + 1)
let position = gap

repeat(count) {
  plant(position)
  position = position + gap
}
