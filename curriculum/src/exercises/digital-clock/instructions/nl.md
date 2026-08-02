---
title: "Digitale klok"
description: "Toon de juiste tijd op een digitale 12-uursklok."
en_md5: e3decc089d371b7113f2657f7571c001
---

In deze opdracht gebruik je twee nieuwe functies om de tijd op te halen:

- `currentTimeHour()` (het huidige uur): geeft het huidige uur terug in 24-uurstijd (15 minuten voor middernacht geeft bijvoorbeeld `23` terug), als een getal.
- `currentTimeMinute()` (het huidige aantal minuten): geeft het huidige aantal minuten terug als een getal.

Je taak is om een digitale klok bij te werken op basis van de getallen die deze functies teruggeven.

De digitale klok verwacht de getallen in een 12-uursnotatie met `am` of `pm` (het zogeheten “meridiem”).

Dus bijvoorbeeld:

- `7:45` -> `7:45am`
- `19:45` -> `7:45pm`

Om de tijd op de klok te tonen gebruik je de functie `displayTime(hour, minutes, meridiem)` (toon de tijd).

In elk scenario verandert de huidige tijd. Je taak is om code te schrijven die alle scenario's laat werken. In het laatste scenario gebruiken we de echte, actuele tijd, dus dat scenario verandert elke keer als de echte tijd een minuut verder gaat!
