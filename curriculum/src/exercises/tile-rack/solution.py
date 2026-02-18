def find_tile(rack, letter):
    position = 0
    for tile in rack:
        if tile == letter:
            return position
        position = position + 1
    return -1