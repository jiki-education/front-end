def pack_lunch(items, capacity):
    lunchbox = []
    backpack = []
    total = 0
    for item in reversed(items):
        name = item[0]
        size = item[1]
        if total + size <= capacity:
            lunchbox.append(name)
            total = total + size
        else:
            backpack.append(name)
    return [lunchbox, backpack]
