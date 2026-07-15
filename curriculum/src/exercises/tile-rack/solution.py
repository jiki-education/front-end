def find_tile(rack, letter):
    position = 1
    for tile in rack:
        if tile == letter:
            return "Move to position " + str(position)
        position = position + 1
    return "Error: Tile not on rack"