age = get_age()

if age < 13:
    child_wristband()
elif age < 18:
    teen_wristband()
elif age < 65:
    adult_wristband()
else:
    senior_wristband()
