def determine_triangle_type(side1, side2, side3):
    if side1 + side2 <= side3:
        return "invalid"
    if side1 + side3 <= side2:
        return "invalid"
    if side2 + side3 <= side1:
        return "invalid"

    if side1 == side2 and side2 == side3:
        return "equilateral"

    if (side1 == side2 or side2 == side3) or (side1 == side3):
        return "isosceles"

    return "scalene"
