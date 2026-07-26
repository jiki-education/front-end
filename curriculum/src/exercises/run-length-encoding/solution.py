def encode(input):
    result = ""
    previous = ""
    count = 0

    for char in input:
        if char == previous:
            count = count + 1
        else:
            if count > 1:
                result = f"{result}{count}"
            result = f"{result}{previous}"
            previous = char
            count = 1

    if count > 1:
        result = f"{result}{count}"
    result = f"{result}{previous}"

    return result


def decode(input):
    result = ""
    count = 0

    for char in input:
        if char in "0123456789":
            count = count * 10 + int(char)
        else:
            if count == 0:
                count = 1
            for i in range(count):
                result = f"{result}{char}"
            count = 0

    return result
