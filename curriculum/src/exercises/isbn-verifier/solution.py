def is_valid_isbn(isbn):
    total = 0
    num = 0
    multiplier = 10

    for char in isbn:
        if char == "X" and multiplier == 1:
            num = 10
        elif char == "-":
            continue
        elif char in "0123456789":
            num = int(char)
        else:
            return False

        total = total + (num * multiplier)
        multiplier = multiplier - 1

    if multiplier != 0:
        return False

    return total % 11 == 0