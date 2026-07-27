def valid(value):
    digits = ""
    for char in value:
        if char == " ":
            continue
        if char not in "0123456789":
            return False
        digits = digits + char

    if len(digits) <= 1:
        return False

    total = 0
    for i in range(len(digits)):
        digit = int(digits[i])

        # Double every second digit, counting from the right.
        if (len(digits) - 1 - i) % 2 == 1:
            digit = digit * 2
            if digit > 9:
                digit = digit - 9

        total = total + digit

    return total % 10 == 0
