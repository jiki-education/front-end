age = get_age()

if age < 13:
    give_child_wristband()
elif age < 18:
    give_teen_wristband()
elif age < 65:
    give_adult_wristband()
else:
    give_senior_wristband()
