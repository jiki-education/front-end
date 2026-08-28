def layout_stars(num_rows):
    result = []
    for i in range(num_rows, 0, -1):
        star = ""
        for j in range(i):
            star = star + "*"
        result.append(star)
    draw_stars(result)