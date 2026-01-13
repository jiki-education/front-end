def in_list(items, target):
    for item in items:
        if item == target:
            return True
    return False


def shopping_list(fridge, recipe):
    lst = []
    for item in recipe:
        if not in_list(fridge, item):
            lst.append(item)
    return lst
