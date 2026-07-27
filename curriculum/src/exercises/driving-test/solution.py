def did_they_pass(marks):
    minors = 0
    for mark in marks:
        if mark == "💥":
            return False
        if mark == "❌":
            minors = minors + 1
    return minors < 5
