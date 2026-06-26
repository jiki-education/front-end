outfit = get_outfit()
age = get_age()

if age >= 18 and (outfit == "ballgown" or outfit == "tuxedo"):
    offer_champagne()
if outfit == "dress" or outfit == "suit" or outfit == "ballgown" or outfit == "tuxedo":
    offer_canapes()
    let_in()
elif age < 18 and on_guest_list():
    let_in()
else:
    turn_away()
