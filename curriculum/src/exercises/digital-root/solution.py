def digital_root(number):
    while number >= 10:
        total = 0
        for char in str(number):
            total = total + int(char)
        number = total
    return number
