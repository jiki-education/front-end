count = num_flowers()
gap = 100 / (count + 1)
position = gap

repeat(count):
    plant(position)
    position = position + gap
