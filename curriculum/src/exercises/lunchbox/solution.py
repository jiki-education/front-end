def pack_a_lunch(sandwich, drink, snack):
    lunchbox = []
    lunchbox.append(sandwich)
    if drink != "milkshake":
        lunchbox.append(drink)
    lunchbox.append(snack)
    return lunchbox