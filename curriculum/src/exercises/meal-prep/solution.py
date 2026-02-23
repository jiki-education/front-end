def in_list(items, target):
    for item in items:
        if item == target:
            return True
    return False


def shopping_list(fridge, recipe):
    lst = []
    for ingredient in recipe:
        if not in_list(fridge, ingredient):
            lst.append(ingredient)
    return lst
