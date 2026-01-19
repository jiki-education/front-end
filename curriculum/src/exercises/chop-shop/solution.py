def name_to_time(name):
    cuts = [
        ["Mohawk", 20],
        ["Slicked-Back Pixie", 15],
        ["Bob", 25],
        ["Shave and Polish", 15],
        ["Afro Trim", 45],
        ["Up-do", 30]
    ]
    for cut in cuts:
        if cut[0] == name:
            return cut[1]

def can_fit_in(queue, next_cut, time):
    for cut in queue:
        time = time - name_to_time(cut)

    return time >= name_to_time(next_cut)
