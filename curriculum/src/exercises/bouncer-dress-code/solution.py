outfit = get_outfit()

if outfit == "ballgown" or outfit == "tuxedo":
    offer_champagne()
    let_in()
elif outfit == "suit" or outfit == "dress":
    let_in()
else:
    turn_away()
