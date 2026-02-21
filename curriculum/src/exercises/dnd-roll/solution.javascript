let attack = roll(20)
let damage = roll(6)
let bonus = roll(4)
announce(attack)
announce(damage)
announce(bonus)
let totalDamage = damage + bonus
strike(attack, totalDamage)
