# Receives a number as its input
# Should return the equivalent raindrop sounds
def raindrops(number):
    result = ""

    if number % 3 == 0:
        result = result + "Pling"
    if number % 5 == 0:
        result = result + "Plang"
    if number % 7 == 0:
        result = result + "Plong"

    if result == "":
        result = str(number)

    return result
