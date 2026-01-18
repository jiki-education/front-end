def did_they_pass(marks):
    minors = 0
    for mark in marks:
        if mark == "💥":
            return False
        elif mark == "❌":
            minors = minors + 1
    return minors < 5
