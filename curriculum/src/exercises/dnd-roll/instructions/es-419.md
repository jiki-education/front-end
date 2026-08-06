---
title: "Tirada de D&D"
description: "Lanza unos dados y golpea a un goblin en una aventura de D&D."
en_md5: 627f6cce99fe83ecae4e1b53051201b9
---

Estás creando un bot que pueda jugar Dungeons and Dragons (DnD). Si no conoces DnD, la idea básica es que te enfrentas a varios escenarios y lanzas dados para ver qué sucede. Hay muchos dados diferentes con distinta cantidad de caras (¡no solo el dado de seis caras al que quizás estés acostumbrado!).

Uno de los escenarios que debes manejar es encontrarte con un goblin. Para atacar al goblin necesitas:

- Genera una **puntuación de ataque** lanzando un dado de 20 caras.
- Genera una **puntuación de daño base** lanzando un dado de 12 caras.
- Genera una **puntuación de daño adicional** lanzando un dado de 10 caras.
- Suma el daño base y el daño adicional para obtener tu **daño total**.
- Golpea al goblin con tu tirada de ataque y el daño total.

Después de cada vez que lanzas un dado, debes anunciar el número que sacaste a las otras personas con las que juegas. Si intentas golpear sin anunciar los números, ¡podrían pensar que estás haciendo trampa!

Tienes tres funciones que puedes usar:

- `roll(sides)` (lanzar) lanza un dado con la cantidad de caras indicada. Esta función devuelve (_returns_ en inglés) el resultado.
- `announce(value)` (anunciar) anuncia una tirada de dado.
- `strike(attack, damage)` (golpear) golpea al goblin con tu tirada de ataque y el daño total.

**Importante:** Cada vez que llamas a `roll()`, Jiki lanza un dado y obtiene un número diferente. No esperes que lanzar el mismo dado dos veces dé el mismo número cada vez.
