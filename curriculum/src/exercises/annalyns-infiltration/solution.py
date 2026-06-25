# Fast attack: only if the knight is asleep
if not knight_is_awake():
    fast_attack()

# Spy: only if at least one of them is awake
if knight_is_awake() or archer_is_awake() or prisoner_is_awake():
    spy()

# Signal: prisoner awake and archer asleep
if prisoner_is_awake() and not archer_is_awake():
    signal_prisoner()

# Free: with the dog (archer asleep), or sneaky (prisoner awake, both kidnappers asleep)
if (has_dog() and not archer_is_awake()) or (not has_dog() and prisoner_is_awake() and not knight_is_awake() and not archer_is_awake()):
    free_prisoner()
