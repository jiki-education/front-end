def on_guest_list(list, person):
    for name in list:
        if name == person:
            return True

    return False
