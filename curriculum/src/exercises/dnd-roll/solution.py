attack = roll(20)
damage = roll(6)
bonus = roll(4)
announce(attack)
announce(damage)
announce(bonus)
total_damage = damage + bonus
strike(attack, total_damage)
