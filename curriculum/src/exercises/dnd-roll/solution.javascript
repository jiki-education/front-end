// Roll the dice
let attack = roll(20)
announce(attack)
let base = roll(12)
announce(base)
let bonus = roll(10)
announce(bonus)

strike(attack, base + bonus)
