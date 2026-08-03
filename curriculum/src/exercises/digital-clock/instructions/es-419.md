---
title: "Reloj digital"
description: "Muestra la hora correcta en un reloj digital de 12 horas."
en_md5: e3decc089d371b7113f2657f7571c001
---

En este ejercicio vas a usar dos funciones nuevas para obtener la hora:

- `currentTimeHour()` (hora actual en formato de 24 horas): Devuelve la hora actual usando el formato de 24 horas (por ejemplo, 15 minutos antes de la medianoche devolvería `23`) como número.
- `currentTimeMinute()` (minuto actual): Devuelve el minuto actual como número.

Tu trabajo es actualizar un reloj digital a partir de los números que devuelvan esas funciones.

El reloj digital espera que los números estén en formato de 12 horas con `am` o `pm` (lo que se conoce como «meridiem»).

Así que, por ejemplo:

- `7:45` -> `7:45am`
- `19:45` -> `7:45pm`

Para mostrar la hora en el reloj usas la función `displayTime(hour, minutes, meridiem)` (muestra la hora en el reloj).

En cada escenario, la hora actual cambia. Tu trabajo es escribir código que haga que todos los escenarios funcionen. En el último escenario, usamos la hora real, de modo que el escenario cambiará cada vez que la hora real avance un minuto.
